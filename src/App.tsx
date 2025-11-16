import { Container, Stack, Typography, Button, Box } from '@mui/material';
import { appContainerSx, contentSx } from './App.sx';
import { WelcomeCard } from './components';

function App() {
  return (
    <Box sx={appContainerSx}>
      <Container maxWidth="lg" sx={contentSx}>
        <Stack spacing={4} alignItems="center">
          <Typography variant="h1" component="h1" color="primary">
            Frontend App
          </Typography>
          
          <WelcomeCard 
            title="Witamy w projekcie!"
            subtitle="React 19 + Vite + TypeScript 5 + Material UI"
            description="Projekt został poprawnie zainicjalizowany! Rozpocznij pracę edytując plik src/App.tsx"
          />
          
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="primary">
              Primary Button
            </Button>
            <Button variant="outlined" color="secondary">
              Secondary Button
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default App;

