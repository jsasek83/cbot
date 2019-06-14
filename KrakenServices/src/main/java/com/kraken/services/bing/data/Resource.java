package com.kraken.services.bing.data;

public class Resource {
    private String type;
    private double[] bbox;
    private String name;
    private Point point;
    private Address address;
    private String confidence;
    private String entityType;
    private GeocodePoint[] geocodePoints;
    private String[] matchCodes;

    public String getType() { return type; }
    public void setType(String value) { this.type = value; }

    public double[] getBbox() { return bbox; }
    public void setBbox(double[] value) { this.bbox = value; }

    public String getName() { return name; }
    public void setName(String value) { this.name = value; }

    public Point getPoint() { return point; }
    public void setPoint(Point value) { this.point = value; }

    public Address getAddress() { return address; }
    public void setAddress(Address value) { this.address = value; }

    public String getConfidence() { return confidence; }
    public void setConfidence(String value) { this.confidence = value; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String value) { this.entityType = value; }

    public GeocodePoint[] getGeocodePoints() { return geocodePoints; }
    public void setGeocodePoints(GeocodePoint[] value) { this.geocodePoints = value; }

    public String[] getMatchCodes() { return matchCodes; }
    public void setMatchCodes(String[] value) { this.matchCodes = value; }
}