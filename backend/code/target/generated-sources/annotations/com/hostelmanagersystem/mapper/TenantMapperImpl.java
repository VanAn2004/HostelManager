package com.hostelmanagersystem.mapper;

import com.hostelmanagersystem.dto.request.TenantRequest;
import com.hostelmanagersystem.dto.response.TenantResponse;
import com.hostelmanagersystem.entity.manager.Tenant;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-02T20:34:34+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.43.0.v20250819-1513, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class TenantMapperImpl implements TenantMapper {

    @Override
    public TenantResponse toResponse(Tenant tenant) {
        if ( tenant == null ) {
            return null;
        }

        TenantResponse.TenantResponseBuilder tenantResponse = TenantResponse.builder();

        tenantResponse.checkInDate( tenant.getCheckInDate() );
        tenantResponse.checkOutDate( tenant.getCheckOutDate() );
        tenantResponse.createAt( tenant.getCreateAt() );
        tenantResponse.email( tenant.getEmail() );
        tenantResponse.fullName( tenant.getFullName() );
        tenantResponse.id( tenant.getId() );
        tenantResponse.idCardNumber( tenant.getIdCardNumber() );
        tenantResponse.ownerId( tenant.getOwnerId() );
        tenantResponse.phoneNumber( tenant.getPhoneNumber() );
        tenantResponse.roomId( tenant.getRoomId() );
        tenantResponse.status( tenant.getStatus() );
        tenantResponse.userId( tenant.getUserId() );

        return tenantResponse.build();
    }

    @Override
    public Tenant toEntity(TenantRequest request) {
        if ( request == null ) {
            return null;
        }

        Tenant.TenantBuilder tenant = Tenant.builder();

        tenant.avatarUrl( request.getAvatarUrl() );
        tenant.checkInDate( request.getCheckInDate() );
        tenant.checkOutDate( request.getCheckOutDate() );
        tenant.email( request.getEmail() );
        tenant.fullName( request.getFullName() );
        tenant.idCardNumber( request.getIdCardNumber() );
        tenant.phoneNumber( request.getPhoneNumber() );
        tenant.roomId( request.getRoomId() );
        tenant.userId( request.getUserId() );

        return tenant.build();
    }

    @Override
    public List<TenantResponse> toTenantResponseList(List<Tenant> tenants) {
        if ( tenants == null ) {
            return null;
        }

        List<TenantResponse> list = new ArrayList<TenantResponse>( tenants.size() );
        for ( Tenant tenant : tenants ) {
            list.add( toResponse( tenant ) );
        }

        return list;
    }
}
