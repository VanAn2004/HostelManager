package com.hostelmanagersystem.mapper;

import com.hostelmanagersystem.dto.request.CreateUserRequest;
import com.hostelmanagersystem.dto.response.UserResponse;
import com.hostelmanagersystem.entity.identity.Role;
import com.hostelmanagersystem.entity.identity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-02T20:34:34+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.43.0.v20250819-1513, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserResponse toUserResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse.UserResponseBuilder userResponse = UserResponse.builder();

        userResponse.id( user.getId() );
        userResponse.userName( user.getUserName() );
        userResponse.email( user.getEmail() );
        userResponse.phone( user.getPhone() );
        userResponse.firstName( user.getFirstName() );
        userResponse.lastName( user.getLastName() );
        userResponse.roleName( userRoleName( user ) );
        userResponse.createdAt( user.getCreateAt() );
        if ( user.getIsActive() != null ) {
            userResponse.isActive( user.getIsActive() );
        }

        return userResponse.build();
    }

    @Override
    public User toUser(CreateUserRequest createUserRequest) {
        if ( createUserRequest == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.email( createUserRequest.getEmail() );
        user.firstName( createUserRequest.getFirstName() );
        user.lastName( createUserRequest.getLastName() );
        user.password( createUserRequest.getPassword() );
        user.phone( createUserRequest.getPhone() );
        user.userName( createUserRequest.getUserName() );

        return user.build();
    }

    private String userRoleName(User user) {
        if ( user == null ) {
            return null;
        }
        Role role = user.getRole();
        if ( role == null ) {
            return null;
        }
        String name = role.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
