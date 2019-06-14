package com.kraken.services.warehouse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.kraken.persistence.mongo.repository.WarehouseRepository;
import com.kraken.services.bing.LocationService;
import com.kraken.services.warehouse.data.Warehouse;
import com.kraken.services.warehouse.exception.WarehouseNotFoundException;
import com.kraken.services.warehouse.scrape.WarehouseScraper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WarehouseController {

    @Autowired
    private WarehouseRepository warehouseRepo;

    // @RequestMapping("/warehouses")
    // public List<Warehouse> getWarehouses(@RequestParam(value="latitude") String
    // latitude,
    // @RequestParam(value="longitude") String longitude,
    // @RequestParam(value="numResults", defaultValue = "5") int numResults) {
    // return WarehouseUtil.getWarehousesByGeoLocation(latitude, longitude,
    // numResults);
    // }

    @RequestMapping("/warehouse")
    public Warehouse getWarehouse(
        @RequestParam(value = "warehouseNumber", required = false) Optional<Integer> warehouseNumber,
        @RequestParam(value = "city", required = false) Optional<String> city,
        @RequestParam(value = "state", required = false) Optional<String> state,
        @RequestParam(value = "zipCode", required = false) Optional<String> zipCode) {
        
        Warehouse warehouse = null;
        WarehouseScraper scraper = null;
        if (warehouseNumber.isPresent()) {
            warehouse = warehouseRepo.findByStlocID(Long.valueOf(warehouseNumber.get()));
            if (warehouse == null) {
                scraper = new WarehouseScraper(warehouseNumber.get());
            }
        }
        else if (city.isPresent()) {
            warehouse = warehouseRepo.findByCityIgnoreCase(city.get());
            if (warehouse == null) {
                double[] coordinates = LocationService.getCoordinatesByCityState(city.get(), state.orElse(""));
                scraper = new WarehouseScraper(coordinates[0], coordinates[1], 1);
            }
        }
        else if (zipCode.isPresent()) {
            warehouse = warehouseRepo.findByZipCodeStartingWith(zipCode.get());
            if (warehouse == null) {
                double[] coordinates = LocationService.getCoordinatesByZipCode(zipCode.get());
                scraper = new WarehouseScraper(coordinates[0], coordinates[1], 1);
            }
        }
        else {
            throw new WarehouseNotFoundException();
        }

        if (scraper != null) {
            List<Warehouse> warehouses = new ArrayList<>();
            try {
                warehouses = scraper.getWarehouses();
                warehouse = warehouses.get(0);
                warehouseRepo.save(warehouse);
            } catch (IOException e) {
                e.printStackTrace();
                throw new WarehouseNotFoundException();
            }
        }
        return warehouse;
    }
}
