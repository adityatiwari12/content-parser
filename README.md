# Content Generator Project

This project generates academic research paper content from a user-provided topic.

It follows a formal and research-oriented structure with the required sections:

- Title
- Abstract (150-250 words)
- Introduction
- Literature Review
- Methodology
- Results & Discussion
- Conclusion

## Files

- `generate_content.py`: Main CLI script to generate paper content.
- `prompt_template.txt`: Reusable prompt template for LLM workflows.
- `outputs/`: Optional folder created automatically when saving output.

## Requirements

- Python 3.8 or later

## Usage

Run from the project directory:

```bash
python generate_content.py --topic "Artificial Intelligence in Higher Education"
```

To save output to a Markdown file:

```bash
python generate_content.py --topic "Artificial Intelligence in Higher Education" --save
```

To choose a custom output directory:

```bash
python generate_content.py --topic "Artificial Intelligence in Higher Education" --save --output-dir "my_outputs"
```
