package com.hostelmanagersystem.mapper;

import com.hostelmanagersystem.dto.response.InvoiceResponse;
import com.hostelmanagersystem.entity.manager.Invoice;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-02T20:34:33+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.43.0.v20250819-1513, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class InvoiceMapperImpl implements InvoiceMapper {

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
