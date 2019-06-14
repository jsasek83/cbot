package com.kraken.services.bing.data;

public class Location {
    private String authenticationResultCode;
    private String brandLogoURI;
    private String copyright;
    private ResourceSet[] resourceSets;
    private long statusCode;
    private String statusDescription;
    private String traceID;

    public String getAuthenticationResultCode() { return authenticationResultCode; }
    public void setAuthenticationResultCode(String value) { this.authenticationResultCode = value; }

    public String getBrandLogoURI() { return brandLogoURI; }
    public void setBrandLogoURI(String value) { this.brandLogoURI = value; }

    public String getCopyright() { return copyright; }
    public void setCopyright(String value) { this.copyright = value; }

    public ResourceSet[] getResourceSets() { return resourceSets; }
    public void setResourceSets(ResourceSet[] value) { this.resourceSets = value; }

    public long getStatusCode() { return statusCode; }
    public void setStatusCode(long value) { this.statusCode = value; }

    public String getStatusDescription() { return statusDescription; }
    public void setStatusDescription(String value) { this.statusDescription = value; }

    public String getTraceID() { return traceID; }
    public void setTraceID(String value) { this.traceID = value; }
}
