package com.hostelmanagersystem.mapper;

import com.hostelmanagersystem.dto.request.NotificationCreateRequest;
import com.hostelmanagersystem.dto.response.NotificationResponse;
import com.hostelmanagersystem.entity.manager.Notification;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-02T20:34:34+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.43.0.v20250819-1513, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class NotificationMapperImpl implements NotificationMapper {

    @Override
    public Notification toEntity(NotificationCreateRequest request, String senderId, String recipientId) {
        if ( request == null && senderId == null && recipientId == null ) {
            return null;
        }

        Notification.NotificationBuilder notification = Notification.builder();

        if ( request != null ) {
            notification.message( request.getMessage() );
            notification.title( request.getTitle() );
            notification.type( request.getType() );
        }
        notification.senderId( senderId );
        notification.recipientId( recipientId );

        return notification.build();
    }

    @Override
    public NotificationResponse toDto(Notification notification) {
        if ( notification == null ) {
            return null;
        }

        NotificationResponse.NotificationResponseBuilder notificationResponse = NotificationResponse.builder();

        notificationResponse.createdAt( notification.getCreatedAt() );
        notificationResponse.id( notification.getId() );
        notificationResponse.isRead( notification.getIsRead() );
        notificationResponse.message( notification.getMessage() );
        notificationResponse.recipientId( notification.getRecipientId() );
        notificationResponse.senderId( notification.getSenderId() );
        notificationResponse.title( notification.getTitle() );
        notificationResponse.type( notification.getType() );

        return notificationResponse.build();
    }
}
