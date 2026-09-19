package com.training.trainingscheduler.security;

import com.training.trainingscheduler.exception.ApiException;

/**
 * Principal stored in the SecurityContext for an authenticated request.
 * Lets controllers/services check resource ownership without re-querying the DB.
 */
public record AuthUser(Long id, String email, String role) {

    public boolean isAdmin() {
        return "ADMIN".equals(role);
    }

    /** Throws 403 unless this user owns {@code targetUserId} or is an admin. */
    public void requireOwnerOrAdmin(Long targetUserId, String message) {
        if (!isAdmin() && !id.equals(targetUserId)) {
            throw ApiException.forbidden(message);
        }
    }
}
