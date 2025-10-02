package com.hostelmanagersystem.mapper;

import com.hostelmanagersystem.dto.request.RoomCreationRequest;
import com.hostelmanagersystem.dto.request.RoomUpdateRequest;
import com.hostelmanagersystem.dto.response.RoomResponse;
import com.hostelmanagersystem.entity.manager.Room;
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
public class RoomMapperImpl implements RoomMapper {

    @Override
    public Room toRoom(RoomCreationRequest roomCreationRequest) {
        if ( roomCreationRequest == null ) {
            return null;
        }

        Room.RoomBuilder room = Room.builder();

        room.addressText( roomCreationRequest.getAddressText() );
        room.condition( roomCreationRequest.getCondition() );
        room.description( roomCreationRequest.getDescription() );
        room.district( roomCreationRequest.getDistrict() );
        List<String> list = roomCreationRequest.getFacilities();
        if ( list != null ) {
            room.facilities( new ArrayList<String>( list ) );
        }
        room.floor( roomCreationRequest.getFloor() );
        room.leaseTerm( roomCreationRequest.getLeaseTerm() );
        List<String> list1 = roomCreationRequest.getMediaUrls();
        if ( list1 != null ) {
            room.mediaUrls( new ArrayList<String>( list1 ) );
        }
        room.price( roomCreationRequest.getPrice() );
        room.province( roomCreationRequest.getProvince() );
        room.roomNumber( roomCreationRequest.getRoomNumber() );
        room.roomSize( roomCreationRequest.getRoomSize() );
        room.roomType( roomCreationRequest.getRoomType() );
        room.status( roomCreationRequest.getStatus() );
        room.ward( roomCreationRequest.getWard() );

        return room.build();
    }

    @Override
    public void updateRoom(Room room, RoomUpdateRequest roomUpdateRequest) {
        if ( roomUpdateRequest == null ) {
            return;
        }

        room.setAddressText( roomUpdateRequest.getAddressText() );
        room.setCondition( roomUpdateRequest.getCondition() );
        room.setDescription( roomUpdateRequest.getDescription() );
        room.setDistrict( roomUpdateRequest.getDistrict() );
        if ( room.getFacilities() != null ) {
            List<String> list = roomUpdateRequest.getFacilities();
            if ( list != null ) {
                room.getFacilities().clear();
                room.getFacilities().addAll( list );
            }
            else {
                room.setFacilities( null );
            }
        }
        else {
            List<String> list = roomUpdateRequest.getFacilities();
            if ( list != null ) {
                room.setFacilities( new ArrayList<String>( list ) );
            }
        }
        room.setId( roomUpdateRequest.getId() );
        room.setLeaseTerm( roomUpdateRequest.getLeaseTerm() );
        if ( room.getMediaUrls() != null ) {
            List<String> list1 = roomUpdateRequest.getMediaUrls();
            if ( list1 != null ) {
                room.getMediaUrls().clear();
                room.getMediaUrls().addAll( list1 );
            }
            else {
                room.setMediaUrls( null );
            }
        }
        else {
            List<String> list1 = roomUpdateRequest.getMediaUrls();
            if ( list1 != null ) {
                room.setMediaUrls( new ArrayList<String>( list1 ) );
            }
        }
        room.setPrice( roomUpdateRequest.getPrice() );
        room.setProvince( roomUpdateRequest.getProvince() );
        room.setRoomNumber( roomUpdateRequest.getRoomNumber() );
        room.setRoomSize( roomUpdateRequest.getRoomSize() );
        room.setRoomType( roomUpdateRequest.getRoomType() );
        room.setStatus( roomUpdateRequest.getStatus() );
        room.setWard( roomUpdateRequest.getWard() );
    }

    @Override
    public RoomResponse toRoomResponse(Room room) {
        if ( room == null ) {
            return null;
        }

        RoomResponse.RoomResponseBuilder roomResponse = RoomResponse.builder();

        roomResponse.addressText( room.getAddressText() );
        roomResponse.condition( room.getCondition() );
        roomResponse.description( room.getDescription() );
        roomResponse.district( room.getDistrict() );
        List<String> list = room.getFacilities();
        if ( list != null ) {
            roomResponse.facilities( new ArrayList<String>( list ) );
        }
        roomResponse.floor( room.getFloor() );
        roomResponse.id( room.getId() );
        roomResponse.leaseTerm( room.getLeaseTerm() );
        List<String> list1 = room.getMediaUrls();
        if ( list1 != null ) {
            roomResponse.mediaUrls( new ArrayList<String>( list1 ) );
        }
        roomResponse.price( room.getPrice() );
        roomResponse.province( room.getProvince() );
        roomResponse.roomNumber( room.getRoomNumber() );
        roomResponse.roomSize( room.getRoomSize() );
        roomResponse.roomType( room.getRoomType() );
        roomResponse.status( room.getStatus() );
        roomResponse.ward( room.getWard() );

        return roomResponse.build();
    }

    @Override
    public List<RoomResponse> toResponseList(List<Room> rooms) {
        if ( rooms == null ) {
            return null;
        }

        List<RoomResponse> list = new ArrayList<RoomResponse>( rooms.size() );
        for ( Room room : rooms ) {
            list.add( toRoomResponse( room ) );
        }

        return list;
    }
}
