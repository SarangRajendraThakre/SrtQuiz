import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./mtp.css";

const data = [
  { id: "item-1", content: "Item 1" },
  { id: "item-2", content: "Item 2" },
  { id: "item-3", content: "Item 3" },
  { id: "item-4", content: "Item 4" },
  { id: "item-5", content: "Item 5" },
  { id: "item-6", content: "Item 6" },
  { id: "item-7", content: "Item 7" },
  { id: "item-8", content: "Item 8" },
  { id: "item-9", content: "Item 9" },
];

const Matching = () => {
  const [items, setItems] = useState(data);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    setItems(reorderedItems);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  return (
    <div className="main_content">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="droppable-container"
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="draggable-item"
                      style={{
                        ...provided.draggableProps.style,
                        background: snapshot.isDragging
                          ? "#f8f9fa"
                          : "#ffffff",
                        boxShadow: snapshot.isDragging
                          ? "0px 5px 5px 0px rgba(0,0,0,0.2)"
                          : "none",
                      }}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Matching;
