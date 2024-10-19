import * as OutlineIcons from '@heroicons/react/24/outline';
import * as SolidIcons from '@heroicons/react/24/solid';
import React from 'react';

export type IconName = keyof typeof OutlineIcons;

interface DynamicHeroIconProps extends React.SVGProps<SVGSVGElement> {
    iconName: IconName;
    variant?: 'outline' | 'solid';
}

const DynamicHeroIcon: React.FC<DynamicHeroIconProps> = ({
    iconName,
    variant = 'outline',
    ...props
}) => {
    const icons = variant === 'solid' ? SolidIcons : OutlineIcons;

    const IconComponent = icons[iconName];

    if (!IconComponent) {
        console.error(
        `Icon "${iconName}" not found in @heroicons/react/24/${variant}`
        );
        return null;
    }

    return <IconComponent {...props} />;
};

export default DynamicHeroIcon;
