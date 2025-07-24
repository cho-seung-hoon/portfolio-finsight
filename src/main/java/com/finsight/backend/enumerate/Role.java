package com.finsight.backend.enumerate;

public enum Role {
    INCOMPLETE("incomplete"),
    COMPLETE("complete");

    private final String dbValue;

    Role(String dbValue) {
        this.dbValue = dbValue;
    }

    @Override
    public String toString() {
        return dbValue;
    }
}

