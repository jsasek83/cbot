package com.kraken.services.bing;

import com.kraken.services.bing.data.Location;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class LocationService {

    private static final String BING_API_KEY = "AliUbDgAOrJ2ssofjcrUr70UI1Z4BHrHVhTLeLx7LfI3QoxXUy-JiPyjgxSr8fPc";
    private static final String END_POINT = "https://dev.virtualearth.net/REST/v1/Locations";

    public static double[] getCoordinatesByCityState(String city, String state) {
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(END_POINT)
            .queryParam("locality", city)
            .queryParam("adminDistrict", state)
            .queryParam("key", BING_API_KEY);
        RestTemplate restTemplate = new RestTemplate();
        Location location = restTemplate.getForObject(uriBuilder.toUriString(), Location.class);
        return location.getResourceSets()[0].getResources()[0].getPoint().getCoordinates();
    }

    public static double[] getCoordinatesByZipCode(String zipCode) {
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(END_POINT)
            .queryParam("postalCode", zipCode)
            .queryParam("key", BING_API_KEY);
        RestTemplate restTemplate = new RestTemplate();
        Location location = restTemplate.getForObject(uriBuilder.toUriString(), Location.class);
        return location.getResourceSets()[0].getResources()[0].getPoint().getCoordinates();
    }
}
