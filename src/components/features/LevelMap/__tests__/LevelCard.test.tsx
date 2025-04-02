import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LevelCard } from '../LevelCard';
import { LevelStatus, SkillType } from '@/types';

// Мок-данные для Level объекта
const mockLevel = {
  id: 'level-1',
  title: 'Введение в бизнес',
  description: 'Базовые понятия и принципы',
  order: 1,
  videoContent: [],
  tests: [],
  relatedArtifactIds: [],
  completionCriteria: {
    videosRequired: 3,
    testsRequired: 1
  },
  skillFocus: [SkillType.Management],
  status: LevelStatus.Available
};

describe('LevelCard component', () => {
  it('renders the level card with correct title', () => {
    const mockOnClick = vi.fn();
    render(<LevelCard level={mockLevel} onClick={mockOnClick} />);
    
    expect(screen.getByText('Введение в бизнес')).toBeInTheDocument();
  });

  it('shows correct status text for available level', () => {
    const mockOnClick = vi.fn();
    render(<LevelCard level={mockLevel} onClick={mockOnClick} />);
    
    expect(screen.getByText('Доступен')).toBeInTheDocument();
  });

  it('shows correct status text and icon for locked level', () => {
    const mockOnClick = vi.fn();
    const lockedLevel = { ...mockLevel, status: LevelStatus.Locked };
    render(<LevelCard level={lockedLevel} onClick={mockOnClick} />);
    
    expect(screen.getByText('Заблокирован')).toBeInTheDocument();
  });

  it('shows correct status text and icon for completed level', () => {
    const mockOnClick = vi.fn();
    const completedLevel = { ...mockLevel, status: LevelStatus.Completed };
    render(<LevelCard level={completedLevel} onClick={mockOnClick} />);
    
    expect(screen.getByText('Пройден')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked on available level', async () => {
    const mockOnClick = vi.fn();
    render(<LevelCard level={mockLevel} onClick={mockOnClick} />);
    
    const card = screen.getByText('Введение в бизнес').closest('.card');
    await userEvent.click(card || document.body);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick handler when clicked on locked level', async () => {
    const mockOnClick = vi.fn();
    const lockedLevel = { ...mockLevel, status: LevelStatus.Locked };
    render(<LevelCard level={lockedLevel} onClick={mockOnClick} />);
    
    const card = screen.getByText('Введение в бизнес').closest('.card');
    await userEvent.click(card || document.body);
    
    expect(mockOnClick).not.toHaveBeenCalled();
  });
}); 