package com.kraken.services.bing.data;

public class GeocodePoint {
    private String type;
    private double[] coordinates;
    private String calculationMethod;
    private String[] usageTypes;

    public String getType() { return type; }
    public void setType(String value) { this.type = value; }

    public double[] getCoordinates() { return coordinates; }
    public void setCoordinates(double[] value) { this.coordinates = value; }

    public String getCalculationMethod() { return calculationMethod; }
    public void setCalculationMethod(String value) { this.calculationMethod = value; }

    public String[] getUsageTypes() { return usageTypes; }
    public void setUsageTypes(String[] value) { this.usageTypes = value; }
}