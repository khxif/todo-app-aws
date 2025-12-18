'use client';

import { Droppable } from '@/components/droppable';
import { CreateTodoModal } from '@/components/modals/create-todo';
import { SortableItem } from '@/components/sortable-item';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateTodoStatus } from '@/db';
import { useTodos } from '@/hooks/use-todos';
import {
  closestCenter,
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
          collisionDetection={closestCenter}
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
    if (!over) return;

    const activeId = active.id;

    const sourceColumn = active.data.current?.sortable?.containerId as keyof TaskState;
    const destinationColumn = (over.data.current?.sortable?.containerId || // dropped on item
      over.id) as keyof TaskState; // dropped on empty column

    if (!sourceColumn || !destinationColumn) return;
    if (sourceColumn === destinationColumn) return;

    updateTodoStatus(
      activeId as string,
      destinationColumn === 'todos' ? 'todo' : destinationColumn,
    );

    setActiveId(null);
  }
}

const statuses: Record<string, string> = {
  todos: 'Todos',
  inProgress: 'In Progress',
  done: 'Done',
};
