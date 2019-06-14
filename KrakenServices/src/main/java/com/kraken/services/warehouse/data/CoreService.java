package com.kraken.services.warehouse.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CoreService {
    private String name;
    private String localizedName;
    private String phone;

    public String getName() { return name; }
    public void setName(String value) { this.name = value; }

    public String getLocalizedName() { return localizedName; }
    public void setLocalizedName(String value) { this.localizedName = value; }

    public String getPhone() { return phone; }
    public void setPhone(String value) { this.phone = value; }
}