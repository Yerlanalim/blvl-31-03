import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LevelMap } from '../LevelMap';
import { LevelStatus, SkillType } from '@/types';

// Мок-данные для массива уровней
const mockLevels = [
  {
    id: 'level-1',
    title: 'Уровень 1',
    description: 'Описание уровня 1',
    order: 1,
    videoContent: [],
    tests: [],
    relatedArtifactIds: [],
    completionCriteria: {
      videosRequired: 3,
      testsRequired: 1
    },
    skillFocus: [SkillType.Management],
    status: LevelStatus.Completed
  },
  {
    id: 'level-2',
    title: 'Уровень 2',
    description: 'Описание уровня 2',
    order: 2,
    videoContent: [],
    tests: [],
    relatedArtifactIds: [],
    completionCriteria: {
      videosRequired: 3,
      testsRequired: 1
    },
    skillFocus: [SkillType.Finance],
    status: LevelStatus.Available
  },
  {
    id: 'level-3',
    title: 'Уровень 3',
    description: 'Описание уровня 3',
    order: 3,
    videoContent: [],
    tests: [],
    relatedArtifactIds: [],
    completionCriteria: {
      videosRequired: 3,
      testsRequired: 1
    },
    skillFocus: [SkillType.Marketing],
    status: LevelStatus.Locked
  }
];

describe('LevelMap component', () => {
  it('renders loading skeletons when isLoading is true', () => {
    const mockOnLevelClick = vi.fn();
    render(<LevelMap levels={[]} isLoading={true} onLevelClick={mockOnLevelClick} />);
    
    const skeletons = screen.getAllByTestId(/skeleton/i);
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders all level cards when not loading', () => {
    const mockOnLevelClick = vi.fn();
    render(<LevelMap levels={mockLevels} isLoading={false} onLevelClick={mockOnLevelClick} />);
    
    expect(screen.getByText('Уровень 1')).toBeInTheDocument();
    expect(screen.getByText('Уровень 2')).toBeInTheDocument();
    expect(screen.getByText('Уровень 3')).toBeInTheDocument();
  });

  it('displays correct status for each level', () => {
    const mockOnLevelClick = vi.fn();
    render(<LevelMap levels={mockLevels} isLoading={false} onLevelClick={mockOnLevelClick} />);
    
    expect(screen.getByText('Пройден')).toBeInTheDocument();
    expect(screen.getByText('Доступен')).toBeInTheDocument();
    expect(screen.getByText('Заблокирован')).toBeInTheDocument();
  });

  it('calls onLevelClick with the correct levelId when a level card is clicked', async () => {
    const mockOnLevelClick = vi.fn();
    render(<LevelMap levels={mockLevels} isLoading={false} onLevelClick={mockOnLevelClick} />);
    
    const levelCard = screen.getByText('Уровень 2').closest('.card');
    await userEvent.click(levelCard || document.body);
    
    expect(mockOnLevelClick).toHaveBeenCalledWith('level-2');
  });

  it('does not call onLevelClick when a locked level is clicked', async () => {
    const mockOnLevelClick = vi.fn();
    render(<LevelMap levels={mockLevels} isLoading={false} onLevelClick={mockOnLevelClick} />);
    
    const lockedLevelCard = screen.getByText('Уровень 3').closest('.card');
    await userEvent.click(lockedLevelCard || document.body);
    
    expect(mockOnLevelClick).not.toHaveBeenCalled();
  });
}); 