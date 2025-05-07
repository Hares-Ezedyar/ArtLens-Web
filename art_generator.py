import numpy as np
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw
import os
import datetime
import random

def generate_geometric_art(width, height, color_palette, theme):
    """Generate geometric abstract art"""
    # Create a blank image with white background
    image = Image.new('RGB', (width, height), 'white')
    draw = ImageDraw.Draw(image)
    
    # Define color palettes
    palettes = {
        'vibrant': [(255, 0, 0), (0, 255, 0), (0, 0, 255), (255, 255, 0), (255, 0, 255), (0, 255, 255)],
        'pastel': [(255, 182, 193), (173, 216, 230), (152, 251, 152), (255, 239, 213), (221, 160, 221)],
        'monochrome': [(0, 0, 0), (50, 50, 50), (100, 100, 100), (150, 150, 150), (200, 200, 200)],
        'earthy': [(121, 85, 72), (109, 76, 65), (141, 110, 99), (188, 170, 164), (215, 204, 200)],
        'ocean': [(0, 105, 148), (0, 119, 190), (0, 167, 186), (0, 150, 199), (0, 180, 216)]
    }
    
    # Get colors for the selected palette
    colors = palettes.get(color_palette, palettes['vibrant'])
    
    # Theme influences the shapes and composition
    if theme == 'nature':
        # More organic shapes, curves
        for _ in range(20):
            x1, y1 = random.randint(0, width), random.randint(0, height)
            x2, y2 = x1 + random.randint(-100, 100), y1 + random.randint(-100, 100)
            x3, y3 = x1 + random.randint(-100, 100), y1 + random.randint(-100, 100)
            draw.polygon([(x1, y1), (x2, y2), (x3, y3)], fill=random.choice(colors))
    elif theme == 'space':
        # More angular, scattered shapes
        for _ in range(30):
            x, y = random.randint(0, width), random.randint(0, height)
            size = random.randint(5, 50)
            draw.rectangle([x, y, x+size, y+size], fill=random.choice(colors))
    elif theme == 'urban':
        # Grid-like structures
        grid_size = 30
        for x in range(0, width, grid_size):
            for y in range(0, height, grid_size):
                if random.random() > 0.3:  # 70% chance to draw a shape
                    shape_type = random.choice(['rect', 'circle'])
                    if shape_type == 'rect':
                        draw.rectangle([x, y, x+grid_size, y+grid_size], fill=random.choice(colors))
                    else:
                        draw.ellipse([x, y, x+grid_size, y+grid_size], fill=random.choice(colors))
    elif theme == 'abstract':
        # Random geometric shapes
        for _ in range(40):
            shape_type = random.choice(['rect', 'circle', 'line', 'polygon'])
            color = random.choice(colors)
            
            if shape_type == 'rect':
                x, y = random.randint(0, width), random.randint(0, height)
                w, h = random.randint(20, 100), random.randint(20, 100)
                draw.rectangle([x, y, x+w, y+h], fill=color)
            elif shape_type == 'circle':
                x, y = random.randint(0, width), random.randint(0, height)
                r = random.randint(10, 50)
                draw.ellipse([x-r, y-r, x+r, y+r], fill=color)
            elif shape_type == 'line':
                x1, y1 = random.randint(0, width), random.randint(0, height)
                x2, y2 = random.randint(0, width), random.randint(0, height)
                draw.line([(x1, y1), (x2, y2)], fill=color, width=random.randint(1, 10))
            elif shape_type == 'polygon':
                points = []
                for _ in range(random.randint(3, 6)):
                    points.append((random.randint(0, width), random.randint(0, height)))
                draw.polygon(points, fill=color)
    else:  # ocean theme
        # Wave-like patterns
        for y in range(0, height, 10):
            amplitude = random.randint(5, 20)
            frequency = random.random() * 0.1
            phase = random.random() * 10
            
            points = []
            for x in range(0, width, 5):
                y_offset = amplitude * np.sin(frequency * x + phase)
                points.append((x, y + y_offset))
            
            # Close the shape at the bottom
            points.append((width, height))
            points.append((0, height))
            
            draw.polygon(points, fill=random.choice(colors))
    
    return image

def generate_pixel_art(width, height, color_palette, theme):
    """Generate pixel art"""
    # Create a blank image with white background
    image = Image.new('RGB', (width, height), 'white')
    pixels = image.load()
    
    # Define color palettes
    palettes = {
        'vibrant': [(255, 0, 0), (0, 255, 0), (0, 0, 255), (255, 255, 0), (255, 0, 255), (0, 255, 255)],
        'pastel': [(255, 182, 193), (173, 216, 230), (152, 251, 152), (255, 239, 213), (221, 160, 221)],
        'monochrome': [(0, 0, 0), (50, 50, 50), (100, 100, 100), (150, 150, 150), (200, 200, 200)],
        'earthy': [(121, 85, 72), (109, 76, 65), (141, 110, 99), (188, 170, 164), (215, 204, 200)],
        'ocean': [(0, 105, 148), (0, 119, 190), (0, 167, 186), (0, 150, 199), (0, 180, 216)]
    }
    
    # Get colors for the selected palette
    colors = palettes.get(color_palette, palettes['vibrant'])
    
    # Pixel size (larger = more pixelated)
    pixel_size = 10
    
    # Theme influences the pattern
    if theme == 'nature':
        # Create a nature-inspired pattern (trees, mountains)
        for x in range(0, width, pixel_size):
            # Ground
            ground_height = int(height * 0.7)
            for y in range(ground_height, height, pixel_size):
                for px in range(x, min(x + pixel_size, width)):
                    for py in range(y, min(y + pixel_size, height)):
                        pixels[px, py] = random.choice(colors)
            
            # Trees or mountains
            if random.random() > 0.7:  # 30% chance for a tree/mountain
                tree_height = random.randint(int(height * 0.2), int(height * 0.5))
                tree_width = random.randint(2, 4) * pixel_size
                tree_color = random.choice(colors)
                
                for ty in range(ground_height - tree_height, ground_height, pixel_size):
                    for tx in range(x - tree_width//2, x + tree_width//2, pixel_size):
                        if 0 <= tx < width:
                            for px in range(tx, min(tx + pixel_size, width)):
                                for py in range(ty, min(ty + pixel_size, height)):
                                    if py < ground_height:
                                        pixels[px, py] = tree_color
    
    elif theme == 'space':
        # Space theme with stars and planets
        # Black background
        for x in range(0, width, pixel_size):
            for y in range(0, height, pixel_size):
                for px in range(x, min(x + pixel_size, width)):
                    for py in range(y, min(y + pixel_size, height)):
                        pixels[px, py] = (0, 0, 0)
        
        # Stars
        for _ in range(100):
            star_x = random.randint(0, width - pixel_size)
            star_y = random.randint(0, height - pixel_size)
            star_color = (255, 255, 255)  # White stars
            
            for px in range(star_x, min(star_x + pixel_size, width)):
                for py in range(star_y, min(star_y + pixel_size, height)):
                    pixels[px, py] = star_color
        
        # Planets
        for _ in range(3):
            planet_x = random.randint(0, width - 5*pixel_size)
            planet_y = random.randint(0, height - 5*pixel_size)
            planet_size = random.randint(3, 5) * pixel_size
            planet_color = random.choice(colors)
            
            for x in range(planet_x, min(planet_x + planet_size, width), pixel_size):
                for y in range(planet_y, min(planet_y + planet_size, height), pixel_size):
                    for px in range(x, min(x + pixel_size, width)):
                        for py in range(y, min(y + pixel_size, height)):
                            # Make planets circular
                            dx = px - (planet_x + planet_size//2)
                            dy = py - (planet_y + planet_size//2)
                            if dx*dx + dy*dy <= (planet_size//2)**2:
                                pixels[px, py] = planet_color
    
    elif theme == 'urban':
        # Urban cityscape
        # Sky
        sky_color = random.choice(colors)
        for x in range(0, width, pixel_size):
            for y in range(0, int(height * 0.4), pixel_size):
                for px in range(x, min(x + pixel_size, width)):
                    for py in range(y, min(y + pixel_size, height)):
                        pixels[px, py] = sky_color
        
        # Buildings
        for x in range(0, width, 3*pixel_size):
            building_height = random.randint(int(height * 0.3), int(height * 0.7))
            building_color = random.choice(colors)
            
            for y in range(int(height * 0.4), int(height * 0.4) + building_height, pixel_size):
                for bx in range(x, min(x + 3*pixel_size, width), pixel_size):
                    for px in range(bx, min(bx + pixel_size, width)):
                        for py in range(y, min(y + pixel_size, height)):
                            pixels[px, py] = building_color
            
            # Windows
            for wy in range(int(height * 0.4) + pixel_size, int(height * 0.4) + building_height, 2*pixel_size):
                for wx in range(x + pixel_size, min(x + 2*pixel_size, width), 2*pixel_size):
                    window_color = (255, 255, 0) if random.random() > 0.3 else (100, 100, 100)
                    for px in range(wx, min(wx + pixel_size, width)):
                        for py in range(wy, min(wy + pixel_size, height)):
                            pixels[px, py] = window_color
    
    elif theme == 'abstract':
        # Random pixel patterns
        for x in range(0, width, pixel_size):
            for y in range(0, height, pixel_size):
                color = random.choice(colors)
                for px in range(x, min(x + pixel_size, width)):
                    for py in range(y, min(y + pixel_size, height)):
                        pixels[px, py] = color
    
    else:  # ocean theme
        # Ocean waves
        for y in range(0, height, pixel_size):
            wave_color = random.choice(colors)
            wave_offset = int(10 * np.sin(y * 0.05))
            
            for x in range(0, width, pixel_size):
                for px in range(x + wave_offset, min(x + wave_offset + pixel_size, width)):
                    if 0 <= px < width:
                        for py in range(y, min(y + pixel_size, height)):
                            pixels[px, py] = wave_color
    
    return image

def generate_gradient_art(width, height, color_palette, theme):
    """Generate gradient-based art"""
    # Create a blank image
    image = np.zeros((height, width, 3), dtype=np.uint8)
    
    # Define color palettes
    palettes = {
        'vibrant': [(255, 0, 0), (0, 255, 0), (0, 0, 255), (255, 255, 0), (255, 0, 255), (0, 255, 255)],
        'pastel': [(255, 182, 193), (173, 216, 230), (152, 251, 152), (255, 239, 213), (221, 160, 221)],
        'monochrome': [(0, 0, 0), (50, 50, 50), (100, 100, 100), (150, 150, 150), (200, 200, 200)],
        'earthy': [(121, 85, 72), (109, 76, 65), (141, 110, 99), (188, 170, 164), (215, 204, 200)],
        'ocean': [(0, 105, 148), (0, 119, 190), (0, 167, 186), (0, 150, 199), (0, 180, 216)]
    }
    
    # Get colors for the selected palette
    colors = palettes.get(color_palette, palettes['vibrant'])
    
    # Select two random colors from the palette
    color1 = random.choice(colors)
    color2 = random.choice([c for c in colors if c != color1])
    
    # Theme influences the gradient pattern
    if theme == 'nature':
        # Radial gradient (like sun/flower)
        center_x, center_y = width // 2, height // 2
        max_dist = np.sqrt(center_x**2 + center_y**2)
        
        for y in range(height):
            for x in range(width):
                dist = np.sqrt((x - center_x)**2 + (y - center_y)**2)
                ratio = dist / max_dist
                
                r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
                g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
                b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
                
                image[y, x] = [r, g, b]
    
    elif theme == 'space':
        # Multiple radial gradients (like stars/galaxies)
        centers = [(random.randint(0, width), random.randint(0, height)) for _ in range(5)]
        colors = random.sample(colors, min(5, len(colors)))
        
        # Black background
        image.fill(0)
        
        for (center_x, center_y), color in zip(centers, colors):
            max_dist = width // 3  # Limit the gradient radius
            
            for y in range(max(0, center_y - max_dist), min(height, center_y + max_dist)):
                for x in range(max(0, center_x - max_dist), min(width, center_x + max_dist)):
                    dist = np.sqrt((x - center_x)**2 + (y - center_y)**2)
                    if dist < max_dist:
                        ratio = dist / max_dist
                        
                        r = int(color[0] * (1 - ratio))
                        g = int(color[1] * (1 - ratio))
                        b = int(color[2] * (1 - ratio))
                        
                        # Blend with existing color
                        image[y, x] = np.minimum(image[y, x] + [r, g, b], 255)
    
    elif theme == 'urban':
        # Horizontal bands (like city skyline)
        num_bands = random.randint(5, 10)
        band_height = height // num_bands
        
        for i in range(num_bands):
            y_start = i * band_height
            y_end = (i + 1) * band_height
            
            # Select random color for this band
            band_color = random.choice(colors)
            
            for y in range(y_start, min(y_end, height)):
                for x in range(width):
                    # Add some noise to create texture
                    noise = random.randint(-20, 20)
                    r = max(0, min(255, band_color[0] + noise))
                    g = max(0, min(255, band_color[1] + noise))
                    b = max(0, min(255, band_color[2] + noise))
                    
                    image[y, x] = [r, g, b]
    
    elif theme == 'abstract':
        # Perlin-like noise gradient
        scale = 0.01  # Scale factor for noise
        
        for y in range(height):
            for x in range(width):
                # Simple noise function
                noise = np.sin(x * scale) * np.cos(y * scale) * 0.5 + 0.5
                
                r = int(color1[0] * noise + color2[0] * (1 - noise))
                g = int(color1[1] * noise + color2[1] * (1 - noise))
                b = int(color1[2] * noise + color2[2] * (1 - noise))
                
                image[y, x] = [r, g, b]
    
    else:  # ocean theme
        # Horizontal waves
        for y in range(height):
            # Wave pattern
            wave = np.sin(y * 0.05) * 0.5 + 0.5
            
            for x in range(width):
                # Add horizontal variation
                h_var = np.sin(x * 0.01) * 0.2
                blend = wave + h_var
                blend = max(0, min(1, blend))
                
                r = int(color1[0] * blend + color2[0] * (1 - blend))
                g = int(color1[1] * blend + color2[1] * (1 - blend))
                b = int(color1[2] * blend + color2[2] * (1 - blend))
                
                image[y, x] = [r, g, b]
    
    return Image.fromarray(image)

def generate_fractal_art(width, height, color_palette, theme):
    """Generate fractal art"""
    # Create a blank image
    image = np.zeros((height, width, 3), dtype=np.uint8)
    
(Content truncated due to size limit. Use line ranges to read in chunks)