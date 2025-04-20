import { NgClass, NgFor, NgStyle } from '@angular/common';
import { Component, effect, inject, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { input } from '@angular/core';
import { Category, PositionedCategory } from '../../models/category.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories-box',
  templateUrl: './categories-box.component.html',
  styleUrls: ['./categories-box.component.scss'],
  imports: [NgFor, NgClass, NgStyle, RouterLink]
})
export class CategoriesBoxComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  readonly categories = input<Category[]>();
  positionedCategories: PositionedCategory[] = [];
  
  // Container dimensions
  private containerWidth = 0;
  private containerHeight = 0;
  
  // Grid cell dimensions
  private cellWidth = 70; // Grid cell width in pixels
  private cellHeight = 50; // Grid cell height in pixels
  
  // Grid state tracking
  private gridOccupancy: boolean[][] = [];
  private usedRows: Set<number> = new Set(); // Track which rows already have a category

  constructor() {
    // React to changes in categories
    effect(() => {
      if (this.categories()) {
        setTimeout(() => this.positionCategories(), 100);
      }
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.updateContainerDimensions();
    }, 0);
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.updateContainerDimensions();
      this.positionCategories();
    }, 100);
    
    window.addEventListener('resize', () => {
      this.updateContainerDimensions();
      this.positionCategories();
    });
  }

  private updateContainerDimensions() {
    const container = this.elementRef.nativeElement.querySelector('.categories-items');
    if (container) {
      this.containerWidth = container.offsetWidth;
      this.containerHeight = container.offsetHeight;
      if(this.containerHeight==0||this.containerWidth==0)
      {
        let self=this;
        setTimeout(function(){
           self.updateContainerDimensions();
           self.positionCategories();
        },500)
      }
      // Initialize grid occupancy array
      this.initializeGrid();
    }
  }
  
  private initializeGrid() {
    // Calculate grid dimensions based on container size
    const numCols = Math.floor(this.containerWidth / this.cellWidth);
    const numRows = Math.floor(this.containerHeight / this.cellHeight);
    
    // Create a 2D array to track cell occupancy
    this.gridOccupancy = Array(numRows).fill(false).map(() => Array(numCols).fill(false));
    
    // Clear used rows tracking
    this.usedRows = new Set();
  }


  
  private adjustForOverlaps() {
    // Simple overlap detection and resolution
    // This is a basic implementation - you may want something more sophisticated
    for (let i = 0; i < this.positionedCategories.length; i++) {
      for (let j = i + 1; j < this.positionedCategories.length; j++) {
        const cat1 = this.positionedCategories[i];
        const cat2 = this.positionedCategories[j];
        
        // Calculate approximate dimensions as percentages
        const cat1Width = ((cat1.size || 1) * this.cellWidth / this.containerWidth) * 100;
        const cat1Height = (this.cellHeight / this.containerHeight) * 100;
        const cat2Width = ((cat2.size || 1) * this.cellWidth / this.containerWidth) * 100;
        const cat2Height = (this.cellHeight / this.containerHeight) * 100;
        
        // Check for overlap
        if (Math.abs(cat1.left - cat2.left) < (cat1Width + cat2Width) / 2 &&
            Math.abs(cat1.top - cat2.top) < (cat1Height + cat2Height) / 2) {
          
          // Move cat2 to a new random position
          cat2.left = Math.random() * (80) + 10;
          cat2.top = Math.random() * (80) + 10;
          
          // Start over with overlap detection (j = i ensures we check this item again)
          j = i;
        }
      }
    }
  }
  
  positionCategories() {
    if (!this.categories()?.length || !this.containerWidth || !this.containerHeight) return;
    
    // Reset occupancy grid and used rows
    this.initializeGrid();
    
    const categoryItems = [...this.categories()!];
    this.positionedCategories = [];
    
    // Calculate grid dimensions
    const numCols = Math.floor(this.containerWidth / this.cellWidth);
    const numRows = Math.floor(this.containerHeight / this.cellHeight);
    
    if (numCols <= 0 || numRows <= 0) return;
    
    // Shuffle categories for random placement
    this.shuffleArray(categoryItems);
    
    // First pass - try to place each category in an unused row
    categoryItems.forEach(category => {
      const size = category.size || 1;
      
      // Find an available grid cell in an unused row
      const cell = this.findAvailableCellInUnusedRow(size);
      
      if (cell) {
        this.placeCategory(category, cell);
      }
    });
    
    // Second pass - place any remaining categories that couldn't be placed in the first pass
    const remainingCategories = categoryItems.filter(cat => 
      !this.positionedCategories.some(pos => pos.id === cat.id)
    );
    
    if (remainingCategories.length > 0) {
      // If we've used all rows but still have categories left, we'll start staggering vertically
      remainingCategories.forEach(category => {
        const size = category.size || 1;
        
        // Now we'll look for any available cell, but with vertical staggering
        const cell = this.findAvailableCellWithStaggering(size);
        
        if (cell) {
          this.placeCategory(category, cell);
        } else {
          // Last resort - just find any free cell
          const lastResortCell = this.findAnyAvailableCell(size);
          if (lastResortCell) {
            this.placeCategory(category, lastResortCell);
          }
        }
      });
    }
    
    // Convert absolute positions to percentages for rendering
    this.convertToPercentages();
  }
  
  private placeCategory(category: Category, cell: { row: number, col: number }) {
    const size = category.size || 1;
    
    // Mark cells as occupied
    this.markCellsAsOccupied(cell.row, cell.col, size);
    this.usedRows.add(cell.row);
    
    // Convert grid position to pixels
    const left = cell.col * this.cellWidth;
    
    // Add some vertical staggering within the row
    // This ensures categories in same row (if we had to use same row) are not exactly aligned
    const verticalOffset = Math.floor(Math.random() * 20) - 10; // -10 to +10 pixels
    const top = cell.row * this.cellHeight + verticalOffset;
    
    // Add to positioned categories with absolute pixel values
    this.positionedCategories.push({
      ...category,
      left: left,
      top: top
    });
  }
  
  private findAvailableCellInUnusedRow(cellsNeeded: number): { row: number, col: number } | null {
    const numRows = this.gridOccupancy.length;
    if (numRows === 0) return null;
    
    const numCols = this.gridOccupancy[0].length;
    
    // Create a list of all rows that haven't been used yet
    const availableRows: number[] = [];
    for (let row = 0; row < numRows; row++) {
      if (!this.usedRows.has(row)) {
        availableRows.push(row);
      }
    }
    
    // Shuffle available rows for randomness
    this.shuffleArray(availableRows);
    
    // Try each available row
    for (const row of availableRows) {
      // Generate random column positions
      const colPositions = Array.from({ length: numCols }, (_, i) => i);
      this.shuffleArray(colPositions);
      
      // Try each column position in the row
      for (const col of colPositions) {
        if (this.canPlaceAt(row, col, cellsNeeded)) {
          return { row, col };
        }
      }
    }
    
    // If no position found in unused rows, return null
    return null;
  }
  
  private findAvailableCellWithStaggering(cellsNeeded: number): { row: number, col: number } | null {
    const numRows = this.gridOccupancy.length;
    if (numRows === 0) return null;
    
    const numCols = this.gridOccupancy[0].length;
    
    // Create a list of all possible cell positions
    const allPositions: {row: number, col: number}[] = [];
    
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        // We'll prioritize positions that maintain vertical staggering
        allPositions.push({ row, col });
      }
    }
    
    // Shuffle positions for randomness
    this.shuffleArray(allPositions);
    
    // Try to find a position that's vertically staggered from existing categories
    for (const pos of allPositions) {
      if (this.canPlaceAt(pos.row, pos.col, cellsNeeded) && 
          this.isVerticallyStaggered(pos.row, pos.col)) {
        return pos;
      }
    }
    
    // If no staggered position found, return null
    return null;
  }
  
  private findAnyAvailableCell(cellsNeeded: number): { row: number, col: number } | null {
    const numRows = this.gridOccupancy.length;
    if (numRows === 0) return null;
    
    const numCols = this.gridOccupancy[0].length;
    
    // Try each position in a random order
    const allPositions: {row: number, col: number}[] = [];
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        allPositions.push({ row, col });
      }
    }
    
    this.shuffleArray(allPositions);
    
    for (const pos of allPositions) {
      if (this.canPlaceAt(pos.row, pos.col, cellsNeeded)) {
        return pos;
      }
    }
    
    // If all cells are occupied, return a random cell as last resort
    const randomRow = Math.floor(Math.random() * numRows);
    const randomCol = Math.floor(Math.random() * numCols);
    return { row: randomRow, col: randomCol };
  }
  
  private isVerticallyStaggered(row: number, col: number): boolean {
    // Check if this row is already occupied by examining existing categories
    for (const category of this.positionedCategories) {
      const categoryRow = Math.floor(category.top / this.cellHeight);
      if (categoryRow === row) {
        // This row already has a category
        return false;
      }
    }
    return true;
  }
  
  private canPlaceAt(row: number, col: number, cellsNeeded: number): boolean {
    const numRows = this.gridOccupancy.length;
    const numCols = this.gridOccupancy[0].length;
    
    // Check if we're trying to place beyond grid boundaries
    // if (row < 0 || col < 0 || row >= numRows || col + cellsNeeded > numCols) {
      if (row < 0 || col < 0 || row >= numRows || col-1 + cellsNeeded > numCols) {
      return false;
    }
    
    // Check if any needed cell is already occupied
    for (let i = 0; i < cellsNeeded; i++) {
      if (this.gridOccupancy[row][col + i]) {
        return false;
      }
    }
    
    return true;
  }
  
  private markCellsAsOccupied(row: number, col: number, cellsNeeded: number) {
    for (let i = 0; i < cellsNeeded; i++) {
      if (row >= 0 && row < this.gridOccupancy.length && 
          col + i >= 0 && col + i < this.gridOccupancy[0].length) {
        this.gridOccupancy[row][col + i] = true;
      }
    }
  }
  
  private convertToPercentages() {
    // Convert absolute pixel positions to percentages
    this.positionedCategories = this.positionedCategories.map(category => {
      return {
        ...category,
        left: (category.left / this.containerWidth) * 100,
        top: (category.top / this.containerHeight) * 100
      };
    });
  }
  
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  navigateToCategory(id: number) {
    this.router.navigate(['/category', id]);
  }
}