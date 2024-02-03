


import { Photo, StarOutline, Send, InsertDriveFileOutlined, DeleteOutlined,
    MailOutlined, 
    ScheduleSendOutlined,
    ReportOutlined} from '@mui/icons-material';

export const SIDEBAR_DATA = [
    {
        name: 'inbox',
        title: 'Inbox',
        icon: Photo,
        path: '/inbox',
    },
    {
        name: 'starred',
        title: 'Starred',
        icon: StarOutline,
        path: '/starred',
    },
    {
        name: 'sent',
        title: 'Sent',
        icon: Send,
        path: '/sent',
    },
    {
        name: 'drafts',
        title: 'Drafts',
        icon: InsertDriveFileOutlined,
        path: '/drafts',
    },
    {
        name: 'snoozed',
        title: 'Snoozed',
        icon: ScheduleSendOutlined,
        path: '/snoozed',
    },
    {
        name: 'spam',
        title: 'Spam',
        icon: ReportOutlined,
        path: '/spam',
    },
    {
        name: 'bin',
        title: 'Bin',
        icon: DeleteOutlined,
        path: '/bin',
    },
    {
        name: 'allmail',
        title: 'All Mail',
        icon: MailOutlined,
        path: '/allmail',
    }
];