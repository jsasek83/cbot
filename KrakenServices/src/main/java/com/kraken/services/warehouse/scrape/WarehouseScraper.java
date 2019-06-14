package com.kraken.services.warehouse.scrape;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kraken.services.warehouse.data.Warehouse;

import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

public class WarehouseScraper {
    private static final String END_POINT = "https://www.costco.com/AjaxWarehouseBrowseLookupView";

    private static RestTemplate restTemplate;
    private UriComponentsBuilder endpoint;

    {
        restTemplate = new RestTemplate();
        endpoint = UriComponentsBuilder.fromUriString(END_POINT).queryParam("langId", "-1")
                .queryParam("storeId", "10301").queryParam("hasGas", false).queryParam("hasTires", false)
                .queryParam("hasFood", false).queryParam("hasHearing", false).queryParam("hasPharmacy", false)
                .queryParam("hasOptical", false).queryParam("hasBusiness", false).queryParam("hasPhotoCenter", false)
                .queryParam("tiresCheckout", 0).queryParam("isTransferWarehouse", false)
                .queryParam("warehousePickupCheckout", false).queryParam("populateWarehouseDetails", true);
    }

    public WarehouseScraper(double latitude, double longitude, int numResults) {
        endpoint.queryParam("numOfWarehouses", numResults).queryParam("latitude", latitude).queryParam("longitude",
                longitude);
    }

    public WarehouseScraper(int warehouseNumber) {
        endpoint.queryParam("warehouseNumber", warehouseNumber);
    }

    public List<Warehouse> getWarehouses() throws JsonParseException, JsonMappingException, IOException {
        List<HttpMessageConverter<?>> messageConverters = new ArrayList<HttpMessageConverter<?>>();        
        //Add the Jackson Message converter
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();

        // Note: here we are making this converter to process any kind of response, 
        // not only application/*json, which is the default behaviour
        converter.setSupportedMediaTypes(Collections.singletonList(MediaType.ALL));        
        messageConverters.add(converter);  
        String response = restTemplate.getForObject(endpoint.toUriString(), String.class);
        response = response.replace("[false,", "[");
        response = response.replace("[true,", "[");
        response = response.replaceAll("\\s{2,}", " ");
        ObjectMapper mapper = new ObjectMapper();
        List<Warehouse> warehouses = Arrays.asList(mapper.readValue(response, Warehouse[].class));
        System.out.println(warehouses);
        // restTemplate.setMessageConverters(messageConverters); 
        // warehouses = Arrays.asList(restTemplate.getForObject(endpoint.toUriString(), Warehouse[].class));
        return warehouses;
    }
}