import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import CodeBlock from "../components/CodeBlock";
import GoogleSheetsIcon from "../components/GoogleSheetsIcon";

function ProjectInfoView() {
  const spreadsheetId = "14LBP8tXv1eL2aIiDUblQhpnkfL1ZhAS2AjAcRi3i1Jw";

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", color: "text.primary" }}>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 4,
          display: "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
        }}
      >
        <GoogleSheetsIcon />
        <Typography
          variant="body1"
          component="a"
          href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: "primary.main",
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          https://docs.google.com/spreadsheets/d/{spreadsheetId}/edit
        </Typography>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Ejecutar el Proyecto
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "text.secondary" }}>
          Backend
        </Typography>
        <CodeBlock
          title="Comandos para iniciar el Backend"
          language="bash"
          code="cd backend\nnpm start"
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "text.secondary" }}>
          Frontend
        </Typography>
        <CodeBlock
          title="Comandos para iniciar el Frontend"
          language="bash"
          code="cd frontend\nnpm start"
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Flujo de Trabajo
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          **Subir archivos** → `FileUploader` en React.
        </Typography>
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          **Procesar datos** → Flask extrae info de los formularios.
        </Typography>
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          **Consultar Google Sheets** → Flask obtiene datos de la API.
        </Typography>
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          **Mostrar resultados** → Dashboard en React actualiza métricas.
        </Typography>
      </Box>

      <Typography
        variant="body1"
        sx={{ mt: 4, fontStyle: "italic", color: "text.secondary" }}
      >
        ¿Necesitas ayuda para alguna parte en específico? 😊
      </Typography>
    </Box>
  );
}

export default ProjectInfoView;
