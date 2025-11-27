using System;
using System.Collections.Generic;

namespace ReactAppREST.Server.Models;

public partial class CaUsuario
{
    public int CaUsuaNId { get; set; }

    public string? CaUsuaTApP { get; set; }

    public string? CaUsuaTApM { get; set; }

    public string? CaUsuaTContraseña { get; set; }

    public bool CaUsuaBActivo { get; set; }

    public string? CaUsuaTNombre { get; set; }

    public string? CaUsuaTEmail { get; set; }

}
