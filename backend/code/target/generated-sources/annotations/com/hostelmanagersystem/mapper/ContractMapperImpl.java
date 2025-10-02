package com.hostelmanagersystem.mapper;

import com.hostelmanagersystem.dto.request.ContractCreateRequest;
import com.hostelmanagersystem.dto.request.ContractUpdateRequest;
import com.hostelmanagersystem.dto.response.ContractResponse;
import com.hostelmanagersystem.entity.manager.Contract;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-02T20:34:33+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.43.0.v20250819-1513, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class ContractMapperImpl implements ContractMapper {

    @Override
    public Contract toEntity(ContractCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        Contract.ContractBuilder contract = Contract.builder();

        contract.deposit( request.getDeposit() );
        contract.endDate( request.getEndDate() );
        contract.monthlyPrice( request.getMonthlyPrice() );
        contract.roomId( request.getRoomId() );
        contract.startDate( request.getStartDate() );
        contract.tenantId( request.getTenantId() );
        contract.terms( request.getTerms() );

        return contract.build();
    }

    @Override
    public ContractResponse toResponse(Contract contract) {
        if ( contract == null ) {
            return null;
        }

        ContractResponse.ContractResponseBuilder contractResponse = ContractResponse.builder();

        contractResponse.createdAt( contract.getCreatedAt() );
        contractResponse.deposit( contract.getDeposit() );
        contractResponse.endDate( contract.getEndDate() );
        contractResponse.id( contract.getId() );
        contractResponse.monthlyPrice( contract.getMonthlyPrice() );
        contractResponse.pdfUrl( contract.getPdfUrl() );
        contractResponse.roomId( contract.getRoomId() );
        contractResponse.startDate( contract.getStartDate() );
        contractResponse.status( contract.getStatus() );
        contractResponse.tenantId( contract.getTenantId() );
        contractResponse.terms( contract.getTerms() );
        contractResponse.updatedAt( contract.getUpdatedAt() );

        return contractResponse.build();
    }

    @Override
    public void updateContractFromRequest(ContractUpdateRequest request, Contract contract) {
        if ( request == null ) {
            return;
        }

        contract.setEndDate( request.getEndDate() );
        contract.setMonthlyPrice( request.getMonthlyPrice() );
        contract.setTerms( request.getTerms() );
    }
}
