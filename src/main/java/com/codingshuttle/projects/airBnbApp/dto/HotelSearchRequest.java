package com.codingshuttle.projects.airBnbApp.dto;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class HotelSearchRequest {
    private String city;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate;

    private Integer roomsCount;

    private Integer page = 0;
    private Integer size = 10;
}
