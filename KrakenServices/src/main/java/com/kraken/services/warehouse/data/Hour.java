package com.kraken.services.warehouse.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Hour {
    private String title;
    private String code;
    private String time;

    public String getTitle() { return title; }
    public void setTitle(String value) { this.title = value; }

    public String getCode() { return code; }
    public void setCode(String value) { this.code = value; }

    public String getTime() { return time; }
    public void setTime(String value) { this.time = value; }
}