package com.kraken.services.warehouse.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = WarehouseNotFoundException.WAREHOUSE_NOT_FOUND) // 404
public class WarehouseNotFoundException extends RuntimeException {

    static final String WAREHOUSE_NOT_FOUND = "Warehouse not found";
    private static final long serialVersionUID = 1L;
}