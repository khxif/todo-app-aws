'use client';

import { Droppable } from '@/components/droppable';
import { CreateTodoModal } from '@/components/modals/create-todo';
import { SortableItem } from '@/components/sortable-item';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateTodoPosition, updateTodoStatus } from '@/db';
import { useTodos } from '@/hooks/use-todos';
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React from 'react';

export default function Home() {
  const todos = useTodos();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [isCreateTodoModalOpen, setIsCreateTodoModalOpen] = React.useState(false);

  const activeTodo =
    activeId &&
    Object.values(todos)
      .flat()
      .find(t => t.id === activeId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  return (
    <main className="px-10 py-4 space-y-8">
      <nav className="flex items-center justify-end">
        <Button onClick={() => setIsCreateTodoModalOpen(true)}>Add Todo</Button>
      </nav>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {Object.entries(todos).map(([status, items]) => (
            <Card key={status} className="max-w-sm w-full">
              <CardHeader>
                <CardTitle>{statuses[status]}</CardTitle>
              </CardHeader>
              <CardContent>
                <Droppable id={status}>
                  <SortableContext
                    id={status}
                    items={items.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {items.map(item => (
                      <SortableItem key={item.id} id={item.id} todo={item.todo} />
                    ))}
                  </SortableContext>
                </Droppable>
              </CardContent>
            </Card>
          ))}

          <DragOverlay>
            {activeId ? (
              <SortableItem id={activeId} todo={activeTodo ? activeTodo.todo : ''} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </section>
      <CreateTodoModal isOpen={isCreateTodoModalOpen} setIsOpen={setIsCreateTodoModalOpen} />
    </main>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;
    if (active.id === over.id) return; // No change

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceColumn = active.data.current?.sortable?.containerId as keyof TaskState;
    const destinationColumn = (over.data.current?.sortable?.containerId ||
      over.id) as keyof TaskState;

    if (!sourceColumn || !destinationColumn) return;

    // Reordering within the same column
    if (sourceColumn === destinationColumn) {
      const items = todos[sourceColumn];
      const oldIndex = items.findIndex(item => item.id === activeId);
      const newIndex = items.findIndex(item => item.id === overId);

      if (oldIndex === newIndex) return;

      const reorderedItems = arrayMove(items, oldIndex, newIndex);

      reorderedItems.forEach((item, index) => {
        const newPosition = (index + 1) * 1000;
        if (item.position !== newPosition) updateTodoPosition(item.id, newPosition);
      });

      return;
    }

    // Moving to a different column
    updateTodoStatus(activeId, destinationColumn === 'todos' ? 'todo' : destinationColumn);
  }
}

const statuses: Record<string, string> = {
  todos: 'Todos',
  inProgress: 'In Progress',
  done: 'Done',
};
