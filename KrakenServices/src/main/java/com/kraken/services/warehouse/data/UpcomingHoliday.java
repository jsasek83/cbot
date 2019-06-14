package com.kraken.services.warehouse.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UpcomingHoliday {
    private String holidayName;
    private String holidayDate;
    private String holidayCode;
    private String holidayHours;

    public String getHolidayName() { return holidayName; }
    public void setHolidayName(String value) { this.holidayName = value; }

    public String getHolidayDate() { return holidayDate; }
    public void setHolidayDate(String value) { this.holidayDate = value; }

    public String getHolidayCode() { return holidayCode; }
    public void setHolidayCode(String value) { this.holidayCode = value; }

    public String getHolidayHours() { return holidayHours; }
    public void setHolidayHours(String value) { this.holidayHours = value; }
}