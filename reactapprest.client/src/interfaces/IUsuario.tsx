export interface IUsuario {
  caUsuaNId?: number;
  caUsuaTApP?: string;
  caUsuaTApM?: string;
  caUsuaTContraseña?: string;
  caUsuaBActivo: boolean;
  caUsuaTNombre?: string;
  caUsuaTEmail?: string;
}

export interface IRegistro {
  CaUsuaTApP?: string;
  CaUsuaTApM?: string;
  CaUsuaTContraseña: string;
  CaUsuaTConfirmarContraseña: string;
  CaUsuaTNombre: string;
  CaUsuaTEmail: string;
}

export interface ILogin {
  CaUsuaTEmail: string;
  CaUsuaTContraseña: string;
}