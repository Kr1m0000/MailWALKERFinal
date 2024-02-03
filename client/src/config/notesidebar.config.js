import { DeleteOutlined} from '@mui/icons-material';
import Notes from '@mui/icons-material/Notes';

export const SIDEBAR_DATA = [
    {
        name: 'notes',
        title: 'Notes',
        icon: Notes,
        path: '/Notes',
    },
    {
        name: 'archived',
        title: 'Archived',
        icon: DeleteOutlined,
        path: '/Archived',
    },
];