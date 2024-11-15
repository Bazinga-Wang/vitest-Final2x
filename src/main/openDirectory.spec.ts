import { describe, it, expect, vi, beforeEach } from 'vitest';
import { openDirectory } from './openDirectory';
import { dialog } from 'electron';

vi.mock('electron', () => ({
  dialog: {
    showOpenDialog: vi.fn(),
  },
}));

describe('openDirectory', () => {
  let mockEvent: any;

  beforeEach(() => {
    mockEvent = {
      sender: {
        send: vi.fn(),
      },
    };
    vi.mocked(dialog.showOpenDialog).mockReset();
  });

  it('should open dialog and send selected file paths', async () => {
    const mockFilePaths = ['/path/to/file1', '/path/to/file2'];
    vi.mocked(dialog.showOpenDialog).mockResolvedValue({ filePaths: mockFilePaths });

    await openDirectory(mockEvent, ['openFile', 'multiSelections']);

    expect(dialog.showOpenDialog).toHaveBeenCalledWith({
      properties: ['openFile', 'multiSelections'],
    });
    expect(mockEvent.sender.send).toHaveBeenCalledWith('selectedItem', mockFilePaths);
  });

  it('should handle dialog error', async () => {
    const mockError = new Error('Dialog failed');
    vi.mocked(dialog.showOpenDialog).mockRejectedValue(mockError);

    await openDirectory(mockEvent, ['openDirectory']);

    expect(dialog.showOpenDialog).toHaveBeenCalledWith({
      properties: ['openDirectory'],
    });
    expect(mockEvent.sender.send).not.toHaveBeenCalled();
  });
});
