const ROLE_AVATAR_MAP: Record<string, string> = {
  'Frontend Developer': 'frontend_dev.png',
  'Backend Developer': 'backend_dev.png',
  'DevOps Engineer': 'devops.png',
  'Data Analyst': 'data_analyst.png',
  'UX/UI Designer': 'ux-ui_designer.png',
  'Project Manager': 'project_manager.png',
};

export const getAvatarUrl = (roleName: string): string | undefined => {
  const fileName = ROLE_AVATAR_MAP[roleName];
  if (!fileName) return undefined;
  return `/avatars/${fileName}`;
};
