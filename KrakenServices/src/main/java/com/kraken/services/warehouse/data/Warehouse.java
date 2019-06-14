package com.kraken.services.warehouse.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "warehouses")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Warehouse {

    @Id
    private String id;

    private long stlocID;
    private String displayName;
    private String identifier;
    private String phone;
    private String fax;
    private String address1;
    private String city;
    private String state;
    private String country;
    private String zipCode;
    private String manager;
    private String openDate;
    private String tiresDepartmentPhone;
    private double distance;
    private double latitude;
    private double longitude;
    private long parentGeoNodeID;
    private long active;
    private long languageID;
    private boolean hasGasDepartment;
    private boolean hasTiresDepartment;
    private boolean hasFoodDepartment;
    private boolean hasHearingDepartment;
    private boolean hasPharmacyDepartment;
    private boolean hasOpticalDepartment;
    private boolean hasBusinessDepartment;
    private boolean hasPhotoCenterDepartment;
    private String[] warehouseHours;
    private String[] pharmacyHours;
    private UpcomingHoliday[] upcomingHolidays;
    private Hour[] gasStationHours;
    private Hour[] tireCenterHours;
    private CoreService[] coreServices;
    private CoreService[] specialtyDepartments;
    private String locationName;
    private boolean isShipToWarehouse;
    private boolean isWarehousePickup;
    private boolean enableShipToHome;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public long getStlocID() { return stlocID; }
    public void setStlocID(long value) { this.stlocID = value; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String value) { this.displayName = value; }

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String value) { this.identifier = value; }

    public String getPhone() { return phone; }
    public void setPhone(String value) { this.phone = value; }

    public String getFax() { return fax; }
    public void setFax(String value) { this.fax = value; }

    public String getAddress1() { return address1; }
    public void setAddress1(String value) { this.address1 = value; }

    public String getCity() { return city; }
    public void setCity(String value) { this.city = value; }

    public String getState() { return state; }
    public void setState(String value) { this.state = value; }

    public String getCountry() { return country; }
    public void setCountry(String value) { this.country = value; }

    public String getZipCode() { return zipCode; }
    public void setZipCode(String value) { this.zipCode = value; }

    public String getManager() { return manager; }
    public void setManager(String value) { this.manager = value; }

    public String getOpenDate() { return openDate; }
    public void setOpenDate(String value) { this.openDate = value; }

    public String getTiresDepartmentPhone() { return tiresDepartmentPhone; }
    public void setTiresDepartmentPhone(String value) { this.tiresDepartmentPhone = value; }

    public double getDistance() { return distance; }
    public void setDistance(double value) { this.distance = value; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double value) { this.latitude = value; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double value) { this.longitude = value; }

    public long getParentGeoNodeID() { return parentGeoNodeID; }
    public void setParentGeoNodeID(long value) { this.parentGeoNodeID = value; }

    public long getActive() { return active; }
    public void setActive(long value) { this.active = value; }

    public long getLanguageID() { return languageID; }
    public void setLanguageID(long value) { this.languageID = value; }

    public boolean getHasGasDepartment() { return hasGasDepartment; }
    public void setHasGasDepartment(boolean value) { this.hasGasDepartment = value; }

    public boolean getHasTiresDepartment() { return hasTiresDepartment; }
    public void setHasTiresDepartment(boolean value) { this.hasTiresDepartment = value; }

    public boolean getHasFoodDepartment() { return hasFoodDepartment; }
    public void setHasFoodDepartment(boolean value) { this.hasFoodDepartment = value; }

    public boolean getHasHearingDepartment() { return hasHearingDepartment; }
    public void setHasHearingDepartment(boolean value) { this.hasHearingDepartment = value; }

    public boolean getHasPharmacyDepartment() { return hasPharmacyDepartment; }
    public void setHasPharmacyDepartment(boolean value) { this.hasPharmacyDepartment = value; }

    public boolean getHasOpticalDepartment() { return hasOpticalDepartment; }
    public void setHasOpticalDepartment(boolean value) { this.hasOpticalDepartment = value; }

    public boolean getHasBusinessDepartment() { return hasBusinessDepartment; }
    public void setHasBusinessDepartment(boolean value) { this.hasBusinessDepartment = value; }

    public boolean getHasPhotoCenterDepartment() { return hasPhotoCenterDepartment; }
    public void setHasPhotoCenterDepartment(boolean value) { this.hasPhotoCenterDepartment = value; }

    public String[] getWarehouseHours() { return warehouseHours; }
    public void setWarehouseHours(String[] value) { this.warehouseHours = value; }

    public String[] getPharmacyHours() { return pharmacyHours; }
    public void setPharmacyHours(String[] value) { this.pharmacyHours = value; }

    public UpcomingHoliday[] getUpcomingHolidays() { return upcomingHolidays; }
    public void setUpcomingHolidays(UpcomingHoliday[] value) { this.upcomingHolidays = value; }

    public Hour[] getGasStationHours() { return gasStationHours; }
    public void setGasStationHours(Hour[] value) { this.gasStationHours = value; }

    public Hour[] getTireCenterHours() { return tireCenterHours; }
    public void setTireCenterHours(Hour[] value) { this.tireCenterHours = value; }

    public CoreService[] getCoreServices() { return coreServices; }
    public void setCoreServices(CoreService[] value) { this.coreServices = value; }

    public CoreService[] getSpecialtyDepartments() { return specialtyDepartments; }
    public void setSpecialtyDepartments(CoreService[] value) { this.specialtyDepartments = value; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String value) { this.locationName = value; }

    public boolean getIsShipToWarehouse() { return isShipToWarehouse; }
    public void setIsShipToWarehouse(boolean value) { this.isShipToWarehouse = value; }

    public boolean getIsWarehousePickup() { return isWarehousePickup; }
    public void setIsWarehousePickup(boolean value) { this.isWarehousePickup = value; }

    public boolean getEnableShipToHome() { return enableShipToHome; }
    public void setEnableShipToHome(boolean value) { this.enableShipToHome = value; }
}