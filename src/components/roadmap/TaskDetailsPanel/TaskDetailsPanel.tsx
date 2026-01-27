import { Box, Typography, Button, Link, CircularProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ArticleIcon from '@mui/icons-material/Article';
import SchoolIcon from '@mui/icons-material/School';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import type { ResourceLinkType, ResourcesDTO } from '../../../types';
import {
  panelContainerSx,
  panelHeaderSx,
  panelTitleSx,
  stepTitleSx,
  panelContentSx,
  descriptionSx,
  metaContainerSx,
  metaIconSx,
  metaTextSx,
  sectionTitleSx,
  resourcesListSx,
  resourceItemSx,
  resourceIconSx,
  resourceTextSx,
  panelFooterSx,
  emptyStateSx,
  emptyIconSx,
  emptyTextSx,
} from './TaskDetailsPanel.sx';
import type { TaskDetailsPanelProps } from './TaskDetailsPanel.types';

const resourceIconMap: Record<ResourceLinkType, React.ReactNode> = {
  documentation: <ArticleIcon sx={resourceIconSx} />,
  course: <SchoolIcon sx={resourceIconSx} />,
  video: <PlayCircleOutlineIcon sx={resourceIconSx} />,
  article: <DescriptionIcon sx={resourceIconSx} />,
};

export const TaskDetailsPanel = ({
  task,
  stepTitle,
  isCompleted,
  isLoading,
  onMarkComplete,
}: TaskDetailsPanelProps) => {
  if (!task) {
    return (
      <Box sx={panelContainerSx}>
        <Box sx={emptyStateSx}>
          <TouchAppIcon sx={emptyIconSx} />
          <Typography sx={emptyTextSx}>
            Wybierz zadanie z listy, aby zobaczyć szczegóły
          </Typography>
        </Box>
      </Box>
    );
  }

  const resources = task.resources as ResourcesDTO | null;
  const hasResources = resources?.links && resources.links.length > 0;

  return (
    <Box sx={panelContainerSx}>
      <Box sx={panelHeaderSx}>
        <Typography sx={panelTitleSx}>{task.title}</Typography>
        <Typography sx={stepTitleSx}>{stepTitle}</Typography>
      </Box>

      <Box sx={panelContentSx}>
        <Typography sx={descriptionSx}>{task.description}</Typography>

        {task.estimated_hours && (
          <Box sx={metaContainerSx}>
            <AccessTimeIcon sx={metaIconSx} />
            <Typography sx={metaTextSx}>~{task.estimated_hours} godzin</Typography>
          </Box>
        )}

        {hasResources && (
          <>
            <Typography sx={sectionTitleSx}>Zasoby</Typography>
            <Box sx={resourcesListSx}>
              {resources.links.map((resource, index) => (
                <Link
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  sx={resourceItemSx}
                >
                  {resourceIconMap[resource.type]}
                  <Typography sx={resourceTextSx}>{resource.title}</Typography>
                </Link>
              ))}
            </Box>
          </>
        )}
      </Box>

      <Box sx={panelFooterSx}>
        <Button
          variant={isCompleted ? 'outlined' : 'contained'}
          color={isCompleted ? 'success' : 'primary'}
          fullWidth
          onClick={onMarkComplete}
          disabled={isLoading}
          startIcon={
            isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : isCompleted ? (
              <CheckCircleIcon />
            ) : (
              <RadioButtonUncheckedIcon />
            )
          }
        >
          {isCompleted ? 'Ukończono ✓' : 'Oznacz jako ukończony'}
        </Button>
      </Box>
    </Box>
  );
};
