import React, { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
export type MenuItemData = {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
};

interface MenuProps {
    children: ReactNode;
    items?: MenuItemData[];
    trigger?: 'click' | 'hover';
    menuClassName?: string;
}

export const MenuItem: React.FC<{
    onClick?: () => void;
    icon?: ReactNode;
    children: ReactNode;
}> = ({ onClick, icon, children }) => {
    return (
        <li
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
            {icon}
            {children}
        </li>
    );
};

export const Menu: React.FC<MenuProps> = ({
    children,
    items,
    trigger = 'hover',
    menuClassName = '',
}) => {
    const [open, setOpen] = useState(false);
    const toggleOpen = () => setOpen(prev => !prev);
    const showMenu = () => setOpen(true);
    const hideMenu = () => setOpen(false);
    const isHover = trigger === 'hover';
    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (open &&
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    const wrapperProps = isHover
        ? {
            onMouseEnter: showMenu,
            onMouseLeave: (e: React.MouseEvent) => {
                if (!containerRef.current?.contains(e.relatedTarget as Node)) {
                    hideMenu();
                }
            },
        }
        : {};

    return (
        <div
            ref={containerRef}
            className="relative inline-block"
            {...wrapperProps}
        >
            <div onClick={!isHover ? toggleOpen : undefined}>
                {children}
            </div>
            <AnimatePresence>
                {open && (
                    <>
                        <div
                            className="absolute right-0 h-2 w-10 bg-transparent"
                            style={{ bottom: '-8px', zIndex: 25 }}
                        />
                        <motion.div
                            ref={menuRef}
                            className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-20 ${menuClassName}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            onMouseLeave={(e) => {
                                if (isHover && !containerRef.current?.contains(e.relatedTarget as Node)) {
                                    hideMenu();
                                }
                            }}
                        >
                            <div
                                className="absolute w-3 h-3 top-0 right-4 bg-white border-t border-l border-gray-200 transform -translate-y-1/2 rotate-45"
                            />
                            <ul className="py-1 relative z-30">
                                {items
                                    ? items.map((item, i) => (
                                        <MenuItem key={i} onClick={() => {
                                            item.onClick();
                                            hideMenu();
                                        }} icon={item.icon}>
                                            {item.label}
                                        </MenuItem>
                                    ))
                                    : React.Children.map(children, child => {
                                        if (
                                            React.isValidElement(child) &&
                                            child.type === MenuItem
                                        ) {
                                            const typedChild = child as React.ReactElement<React.ComponentProps<typeof MenuItem>>;
                                            return React.cloneElement(typedChild, {
                                                onClick: () => {
                                                    if (typedChild.props.onClick) {
                                                        typedChild.props.onClick();
                                                    }
                                                    hideMenu();
                                                }
                                            });
                                        }
                                        return null;
                                    })
                                }
                            </ul>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};