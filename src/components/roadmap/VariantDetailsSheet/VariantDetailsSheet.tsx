import { Drawer, Box, Typography, Button, Chip, Link, CircularProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ArticleIcon from '@mui/icons-material/Article';
import SchoolIcon from '@mui/icons-material/School';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import StarIcon from '@mui/icons-material/Star';
import type { ResourceLinkType, ResourcesDTO } from '../../../types';
import {
  drawerPaperSx,
  sheetContainerSx,
  handleContainerSx,
  handleSx,
  sheetHeaderSx,
  sheetTitleSx,
  sheetStepTitleSx,
  sheetContentSx,
  sheetDescriptionSx,
  sheetMetaContainerSx,
  sheetMetaIconSx,
  sheetMetaTextSx,
  sheetSectionTitleSx,
  sheetResourcesListSx,
  sheetResourceItemSx,
  sheetResourceIconSx,
  sheetResourceTextSx,
  sheetFooterSx,
} from './VariantDetailsSheet.sx';
import type { VariantDetailsSheetProps } from './VariantDetailsSheet.types';

const resourceIconMap: Record<ResourceLinkType, React.ReactNode> = {
  documentation: <ArticleIcon sx={sheetResourceIconSx} />,
  course: <SchoolIcon sx={sheetResourceIconSx} />,
  video: <PlayCircleOutlineIcon sx={sheetResourceIconSx} />,
  article: <DescriptionIcon sx={sheetResourceIconSx} />,
};

export const VariantDetailsSheet = ({
  open,
  variant,
  stepTitle,
  isCompleted,
  isLoading,
  onMarkComplete,
  onClose,
}: VariantDetailsSheetProps) => {
  if (!variant) {
    return null;
  }

  const resources = variant.resources as ResourcesDTO | null;
  const hasResources = resources?.links && resources.links.length > 0;
  const isRecommended = variant.order_number === 1;

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: drawerPaperSx }}
    >
      <Box sx={sheetContainerSx}>
        <Box sx={handleContainerSx}>
          <Box sx={handleSx} />
        </Box>

        <Box sx={sheetHeaderSx}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Typography sx={sheetTitleSx}>{variant.title}</Typography>
            {isRecommended && (
              <Chip
                icon={<StarIcon />}
                label="Rekomendowany"
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
          <Typography sx={sheetStepTitleSx}>{stepTitle}</Typography>
        </Box>

        <Box sx={sheetContentSx}>
          <Typography sx={sheetDescriptionSx}>{variant.description}</Typography>

          {variant.estimated_hours && (
            <Box sx={sheetMetaContainerSx}>
              <AccessTimeIcon sx={sheetMetaIconSx} />
              <Typography sx={sheetMetaTextSx}>~{variant.estimated_hours} godzin</Typography>
            </Box>
          )}

          {hasResources && (
            <>
              <Typography sx={sheetSectionTitleSx}>Zasoby</Typography>
              <Box sx={sheetResourcesListSx}>
                {resources.links.map((resource, index) => (
                  <Link
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="none"
                    sx={sheetResourceItemSx}
                  >
                    {resourceIconMap[resource.type]}
                    <Typography sx={sheetResourceTextSx}>{resource.title}</Typography>
                  </Link>
                ))}
              </Box>
            </>
          )}
        </Box>

        <Box sx={sheetFooterSx}>
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
    </Drawer>
  );
};
