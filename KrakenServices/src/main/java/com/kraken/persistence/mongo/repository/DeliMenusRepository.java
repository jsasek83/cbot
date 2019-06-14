package com.kraken.persistence.mongo.repository;

import com.kraken.services.deli.data.Menu;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface DeliMenusRepository extends MongoRepository<Menu, String> {
    
}