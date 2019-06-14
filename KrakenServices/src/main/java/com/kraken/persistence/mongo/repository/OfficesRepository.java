package com.kraken.persistence.mongo.repository;

import com.kraken.services.office.data.Office;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface OfficesRepository extends MongoRepository<Office, String> {

}