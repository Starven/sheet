function UIElement(position, width, height, image, image_width, image_height, colour, colour_two, clickable) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.image = image;
    this.image_width = image_width;
    this.image_height = image_height;
    this.colour = colour;
    this.colour_two = colour_two; //for selections
    this.clickable = clickable;
    this.selected = false;
    this.hovered = false;
    this.clicked = function() {

    };
}

UIElement.prototype.mouseOver = function(mx, my) {
    if (mx >= this.position.x && mx <= this.position.x + this.width &&
        my >= this.position.y && my <= this.position.y + this.height) {
            return true;
        }
    return false;
}

UIElement.prototype.render = function(context, canvas) {

    if (this.selected || this.hovered) {
        context.fillStyle = this.colour_two;
    } else {
        context.fillStyle = this.colour;
    }

    let center_imageX = this.position.x + (this.width - this.image_width) / 2;
    let center_imageY = this.position.y + (this.height - this.image_height) / 2;

    context.fillRect(this.position.x, this.position.y, this.width, this.height);
    context.drawImage(this.image, center_imageX, center_imageY, this.image_width, this.image_height);
    
}

