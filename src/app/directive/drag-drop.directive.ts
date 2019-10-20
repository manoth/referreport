import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
    selector: '[appDrag]'
})
export class DragDirective {

    @Output() onFileDropped = new EventEmitter<any>();
    @HostBinding('class') private class = ''

    //Dragover listener
    @HostListener('dragover', ['$event']) onDragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.class = 'uploadfilecontainer';
    }

    //Dragleave listener
    @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.class = '';
    }

    //Drop listener
    @HostListener('drop', ['$event']) public ondrop(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.class = '';
        let files = evt.dataTransfer.files;
        if (files.length > 0) {
            this.onFileDropped.emit(files)
        }
    }

}