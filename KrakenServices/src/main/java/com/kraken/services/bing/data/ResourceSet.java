package com.kraken.services.bing.data;

public class ResourceSet {
    private long estimatedTotal;
    private Resource[] resources;

    public long getEstimatedTotal() { return estimatedTotal; }
    public void setEstimatedTotal(long value) { this.estimatedTotal = value; }

    public Resource[] getResources() { return resources; }
    public void setResources(Resource[] value) { this.resources = value; }
}