import {Trip} from "@prisma/client";
import {ptBR} from "date-fns/locale";
import {format} from "date-fns";

export function invitationMailTemplate(email: string, trip: Trip): string {
    const startDate = format(new Date(trip.startDate), 'dd/MM/yyyy', { locale: ptBR });
    const endDate = format(new Date(trip.endDate), 'dd/MM/yyyy', { locale: ptBR });

    const credentials = `mail=${email}&trip=${trip.id}`;
    const codified = Buffer.from(credentials).toString('base64');

    return `<!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Convite para Viagem</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
            
                    .container {
                        background-color: white;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        width: 500px;
                        max-width: 90%;
                        padding: 20px;
                        text-align: left;
                        color: #333;
                    }
            
                    h1 {
                        font-size: 20px;
                        color: #333;
                    }
            
                    p {
                        font-size: 16px;
                        line-height: 1.5;
                        margin: 10px 0;
                    }
            
                    a {
                        color: #1a73e8;
                        text-decoration: none;
                    }
            
                    a:hover {
                        text-decoration: underline;
                    }
            
                    .footer {
                        margin-top: 30px;
                        border-top: 1px solid #ddd;
                        padding-top: 15px;
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                    }
            
                    .logo {
                        margin-top: 20px;
                        text-align: center;
                    }
            
                    .logo img {
                        width: 40px;
                        height: 40px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.city} - ${trip.country}</strong> entre <strong>${startDate} a ${endDate}.</strong></p>
                    <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
                    <a href="http://localhost:3000/trip/confirmation?${codified}"">Confirmar presença</a>
                    <p>Para acessar a página principal da viagem, clique no link abaixo:</p>
                    <a href="http://localhost:3000/trip/${trip.id}"">Acessar viagem</a>
                    <p>Caso você não saiba do que se trata esse e-mail ou não poderá estar presente, apenas ignore esse e-mail.</p>
                    <div class="footer">
                        <div class="logo">
                            <img src="../images/planner-logo.svg" alt="plann.er">
                        </div>
                        <p>plann.er</p>
                    </div>
                </div>
            </body>
            </html>`;
}