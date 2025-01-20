import { Button } from 'react-bootstrap';
import { useTheme } from '~/providers/ThemeProvider';

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <Button
            onClick={toggleTheme}
            variant={isDark ? 'secondary' : 'primary'}
            className='d-flex align-items-center gap-2'
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        >
            {isDark ? <>Light Mode</> : <>Dark Mode</>}
        </Button>
    );
}
