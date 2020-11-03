// https://www.youtube.com/watch?v=Uvy_BlgwfLI
// Time: 12:18 - 13:15
// The classes for the ouput from each table.

class FoundFile {
  constructor(
    FileID,
    FileName,
    FilePath,
    FileExt,
    CompName,
    FileCreator,
    FileCreated,
    FileModified,
    FileSize
  ) {
    this.FileID = FileID;
    this.FileName = FileName;
    this.FilePath = FilePath;
    this.FileExt = FileExt;
    this.CompName = CompName;
    this.FileCreator = FileCreator;
    this.FileCreated = FileCreated;
    this.FileModified = FileModified;
    this.FileSize = FileSize;
  }
}

module.exports = FoundFile;
