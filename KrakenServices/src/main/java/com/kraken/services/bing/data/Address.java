package com.kraken.services.bing.data;

public class Address {
    private String adminDistrict;
    private String adminDistrict2;
    private String countryRegion;
    private String formattedAddress;
    private String locality;

    public String getAdminDistrict() { return adminDistrict; }
    public void setAdminDistrict(String value) { this.adminDistrict = value; }

    public String getAdminDistrict2() { return adminDistrict2; }
    public void setAdminDistrict2(String value) { this.adminDistrict2 = value; }

    public String getCountryRegion() { return countryRegion; }
    public void setCountryRegion(String value) { this.countryRegion = value; }

    public String getFormattedAddress() { return formattedAddress; }
    public void setFormattedAddress(String value) { this.formattedAddress = value; }

    public String getLocality() { return locality; }
    public void setLocality(String value) { this.locality = value; }
}