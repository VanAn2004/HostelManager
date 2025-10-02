package com.hostelmanagersystem.mapper;

import com.hostelmanagersystem.dto.request.UtilityUsageCreateRequest;
import com.hostelmanagersystem.dto.response.InvoiceResponse;
import com.hostelmanagersystem.dto.response.UtilityConfigResponse;
import com.hostelmanagersystem.dto.response.UtilityUsageResponse;
import com.hostelmanagersystem.entity.manager.Invoice;
import com.hostelmanagersystem.entity.manager.UtilityConfig;
import com.hostelmanagersystem.entity.manager.UtilityUsage;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-02T20:34:34+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.43.0.v20250819-1513, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class UtilityMapperImpl implements UtilityMapper {

    @Override
    public UtilityUsage toEntity(UtilityUsageCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        UtilityUsage.UtilityUsageBuilder utilityUsage = UtilityUsage.builder();

        utilityUsage.includeGarbage( request.getIncludeGarbage() );
        utilityUsage.includeParking( request.getIncludeParking() );
        utilityUsage.includeWifi( request.getIncludeWifi() );
        utilityUsage.month( request.getMonth() );
        utilityUsage.newElectricity( request.getNewElectricity() );
        utilityUsage.newWater( request.getNewWater() );
        utilityUsage.oldElectricity( request.getOldElectricity() );
        utilityUsage.oldWater( request.getOldWater() );
        utilityUsage.roomId( request.getRoomId() );

        return utilityUsage.build();
    }

    @Override
    public UtilityUsageResponse toResponse(UtilityUsage entity) {
        if ( entity == null ) {
            return null;
        }

        UtilityUsageResponse.UtilityUsageResponseBuilder utilityUsageResponse = UtilityUsageResponse.builder();

        utilityUsageResponse.createdAt( entity.getCreatedAt() );
        utilityUsageResponse.id( entity.getId() );
        utilityUsageResponse.includeGarbage( entity.getIncludeGarbage() );
        utilityUsageResponse.includeParking( entity.getIncludeParking() );
        utilityUsageResponse.includeWifi( entity.getIncludeWifi() );
        utilityUsageResponse.month( entity.getMonth() );
        utilityUsageResponse.newElectricity( entity.getNewElectricity() );
        utilityUsageResponse.newWater( entity.getNewWater() );
        utilityUsageResponse.oldElectricity( entity.getOldElectricity() );
        utilityUsageResponse.oldWater( entity.getOldWater() );
        utilityUsageResponse.ownerId( entity.getOwnerId() );
        utilityUsageResponse.roomId( entity.getRoomId() );
        utilityUsageResponse.updatedAt( entity.getUpdatedAt() );

        return utilityUsageResponse.build();
    }

    @Override
    public UtilityConfigResponse toUtilityConfigResponse(UtilityConfig config) {
        if ( config == null ) {
            return null;
        }

        UtilityConfigResponse.UtilityConfigResponseBuilder utilityConfigResponse = UtilityConfigResponse.builder();

        utilityConfigResponse.electricityPricePerUnit( config.getElectricityPricePerUnit() );
        utilityConfigResponse.garbageFee( config.getGarbageFee() );
        utilityConfigResponse.parkingFee( config.getParkingFee() );
        utilityConfigResponse.waterPricePerUnit( config.getWaterPricePerUnit() );
        utilityConfigResponse.wifiFee( config.getWifiFee() );

        return utilityConfigResponse.build();
    }

    @Override
    public InvoiceResponse toInvoiceResponse(Invoice invoice) {
        if ( invoice == null ) {
            return null;
        }

        InvoiceResponse.InvoiceResponseBuilder invoiceResponse = InvoiceResponse.builder();

        invoiceResponse.createdAt( invoice.getCreatedAt() );
        invoiceResponse.description( invoice.getDescription() );
        invoiceResponse.dueDate( invoice.getDueDate() );
        invoiceResponse.electricityAmount( invoice.getElectricityAmount() );
        invoiceResponse.garbageFee( invoice.getGarbageFee() );
        invoiceResponse.id( invoice.getId() );
        invoiceResponse.month( invoice.getMonth() );
        invoiceResponse.parkingFee( invoice.getParkingFee() );
        invoiceResponse.paymentDate( invoice.getPaymentDate() );
        invoiceResponse.paymentMethod( invoice.getPaymentMethod() );
        invoiceResponse.rentAmount( invoice.getRentAmount() );
        invoiceResponse.roomId( invoice.getRoomId() );
        invoiceResponse.status( invoice.getStatus() );
        invoiceResponse.tenantId( invoice.getTenantId() );
        invoiceResponse.totalAmount( invoice.getTotalAmount() );
        if ( invoice.getType() != null ) {
            invoiceResponse.type( invoice.getType().name() );
        }
        invoiceResponse.updatedAt( invoice.getUpdatedAt() );
        invoiceResponse.waterAmount( invoice.getWaterAmount() );
        invoiceResponse.wifiFee( invoice.getWifiFee() );

        return invoiceResponse.build();
    }
}
