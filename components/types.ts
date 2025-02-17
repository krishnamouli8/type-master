export interface NavbarProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export interface StatItemProps {
    value: string | number;
    label: string;
}

export interface TimeOption {
    value: number;
    label: string;
}