// This file will contain all the redundant structures as objects and enums

//**********OBJECTS**********
class User {
    name: string;
    surname: string;
    password: string;
    email: string;
    phone: string;
    role: UserRole;

    constructor(name: string, surname: string, password: string, email: string, phone: string, role: UserRole) {
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.email = email;
        this.phone = phone;
        this.role = role;
    }
}//User

class DocDescription {
    id: number;
    titol: string;
    stakeholders: string;
    scale: string;
    type: DocType;
    connections: number;
    language: string | null;
    pages: number | null;
    coordinates: string;
    summary: string;

    constructor(id: number, titol: string, stakeholders: string, scale: string, type: DocType, connections: number, language: string | null, pages: number | null, coordinates: string, summary: string) {
        this.id = id;
        this.titol = titol;
        this.stakeholders = stakeholders;
        this.scale = scale;
        this.type = type;
        this.connections = connections;
        this.language = language;
        this.pages = pages;
        this.coordinates = coordinates;
        this.summary = summary;
    }
}//DocDescription

//**********ENUMS**********
enum UserRole {
    Uplanner = "PLANNER",
    Udeveloper = "DEVELOPER",
    Visitor = "VISITOR",
    Resident = "RESIDENT"
}//UserRole

enum DocType {
    Plan = "DETAILED_PLAN",
    Competition = "COMPETITION",
    Agreement = "AGREEMENT",
    Forecast = "DEFORMATION_FORECAST"
}//DocType

export {User, DocDescription, UserRole, DocType}