import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import {
  drawerPaperSx,
  drawerContainerSx,
  handleContainerSx,
  handleSx,
  drawerHeaderSx,
  drawerCloseButtonSx,
  drawerTitleSx,
  drawerDescriptionSx,
  drawerProgressRowSx,
  drawerSubtitleSx,
  drawerContentSx,
  getTaskAccordionSx,
  taskAccordionSummarySx,
  taskAccordionSummaryContentSx,
  taskTitleSx,
  taskTimeSx,
  taskAccordionActionsSx,
  taskAccordionDetailsSx,
  taskDescriptionSx,
  checkboxContainerSx,
  drawerFooterSx,
} from './StepTasksDrawer.sx';
import type { StepTasksDrawerProps } from './StepTasksDrawer.types';

export const StepTasksDrawer = ({
  open,
  step,
  completedTaskIds,
  isToggling,
  onClose,
  onToggleTaskCompleted,
}: StepTasksDrawerProps) => {
  if (!step) {
    return null;
  }

  const completedCount = step.step_tasks.filter((t) =>
    completedTaskIds.includes(t.id)
  ).length;
  const totalCount = step.step_tasks.length;

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: drawerPaperSx }}
    >
      <Box sx={drawerContainerSx}>
        <Box sx={handleContainerSx}>
          <Box sx={handleSx} />
        </Box>

        <Box sx={drawerHeaderSx}>
          <IconButton onClick={onClose} size="small" aria-label="Zamknij" sx={drawerCloseButtonSx}>
            <CloseIcon />
          </IconButton>
          <Typography sx={drawerTitleSx}>{step.title}</Typography>
          {step.description && (
            <Typography sx={drawerDescriptionSx}>{step.description}</Typography>
          )}
        </Box>

        <Box sx={drawerProgressRowSx}>
          <Typography sx={drawerSubtitleSx}>
            {completedCount} z {totalCount} ukończonych
          </Typography>
        </Box>

        <Box sx={drawerContentSx}>
          {step.step_tasks.map((task) => {
            const isCompleted = completedTaskIds.includes(task.id);
            return (
              <Accordion
                key={task.id}
                sx={getTaskAccordionSx(isCompleted)}
                disableGutters
                elevation={0}
              >
                <AccordionSummary sx={taskAccordionSummarySx} expandIcon={null}>
                  <Box sx={taskAccordionSummaryContentSx}>
                    <Stack direction="row" alignItems="center" spacing={1} flex={1}>
                      <Box
                        component="span"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isToggling) {
                            onToggleTaskCompleted(task.id, isCompleted);
                          }
                        }}
                        sx={checkboxContainerSx(isCompleted)}
                      >
                        {isCompleted && (
                          <CheckIcon sx={{ color: 'white', fontSize: '0.875rem' }} />
                        )}
                      </Box>
                      <Typography sx={taskTitleSx}>{task.title}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      {task.estimated_hours && (
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                          sx={taskTimeSx}
                        >
                          <AccessTimeIcon sx={{ fontSize: '1rem' }} />
                          <Typography variant="body2">{task.estimated_hours}h</Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                  <Box sx={taskAccordionActionsSx}>
                    <IconButton size="small" aria-label="Rozwiń/Zwiń">
                      <ExpandMoreIcon sx={{ transition: 'transform 0.2s' }} />
                    </IconButton>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={taskAccordionDetailsSx}>
                  <Typography sx={taskDescriptionSx}>
                    {task.description ?? 'Brak opisu zadania.'}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>

        <Box sx={drawerFooterSx}>
          <Typography
            sx={{ fontSize: '0.8125rem', color: 'text.secondary', textAlign: 'center' }}
          >
            Wykonaj wszystkie zadania, aby odblokować następny krok
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};
