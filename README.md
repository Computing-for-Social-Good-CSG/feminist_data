# Data Feminism Bias Reporting Tool Repository

[[Read the Paper](https://dl.acm.org/doi/10.1145/3715275.3732119)] [[Use the Bias Reporting Tool](https://computing-for-social-good-csg.github.io/feminist_data/)]

## What's in this repository? 
There are several items that may be useful to researchers thinking about bias research and ethics reporting. 
1. A [link to the live dataset bias reporting tool](https://computing-for-social-good-csg.github.io/feminist_data/).
   - This tool is a form that dynamically adapts to your input to suggest different forms of potential bias in your dataset. It then summarizes the results in a standardized format. It's designed for Natural Langauge Processing (NLP) researchers and paper authors, but anyone can use it. 
   - Please note this is a prototype, and there are several limitations (i.e. not every language and data source has detailed suggestions).
2. Code for the Bias Reporting Tool.
   - We make the code available for two reasons: so that users of the tool have transparency on how the reports are generated, and so that others can fork or contribute to the tool. If you do fork our code, we ask you cite our repository.
3. [Suggest a citation](#suggest-a-citation)
   - Use a form to suggest a paper or statistic be added to the tool.  
4. [How do I cite this work?](#how-do-i-cite-this-work)
5. [Other paradigms](#other-paradigms) 
   - A list of other bias reporting paradigms that inform this work.
  
## Suggest a citation 
If you have another data source bias, dialect bias, or ethical consideration, you can suggest it [using this form](https://forms.gle/HE3HAQCotgwe11JA7). Please include a relevant one-line statistic, a text citation, and a link to this citation.  

## How do I cite this work? 
**Citation**
> Cass Mayeda, Arinjay Singh, Arnav Mahale, Laila Shereen Sakr, and Mai ElSherief. 2025. Applying Data Feminism Principles to Assess Bias in English and Arabic NLP Research. In * *The 2025 ACM Conference on Fairness, Accountability, and Transparency (FAccT ’25), June 23–26, 2025, Athens, Greece* *. ACM, New York, NY, USA, 24 pages. https://doi.org/10.1145/3715275.3732119.

**BibTeX:**
```tex
@inproceedings{mayeda-etal-2025-feminism-assess-NLP,
    title = "Applying Data Feminism Principles to Assess Bias in English and Arabic NLP Research",
    author = "Mayeda, Cass  and
      Singh, Arinjay  and
      Mahale, Arnav  and
      Shereen Sakr, Laila  and
      ElSherief, Mai",
    booktitle = "The 2025 ACM Conference on Fairness, Accountability, and Transparency",
    month = jun,
    year = 2025,
    publisher = "ACM"
}
```
## Other paradigms 
There are other bias reporting paradigms that we referenced and drew inspiration from in creating this tool. Often they are tailored to other types of datasets or models, or reporting contexts. Additionally, most still rely on paper authors to generate potential sources of bias, whereas our tool proactively suggests them.
### General Paradigms (Not Data Type Specific)
- [Dataset Nutrition Labels](https://labelmaker.datanutrition.org/) 
- [Datasheets for Datasets](https://dl.acm.org/doi/10.1145/3458723)
- [Hugging Face Dataset Cards](https://huggingface.co/docs/hub/en/datasets-cards)
- [NeurIPS Checklist](https://neurips.cc/Conferences/2021/PaperInformation/PaperChecklist)
### Business Contexts
- [Apple Privacy Labels](https://www.apple.com/privacy/)
- [Google Model Cards](https://modelcards.withgoogle.com/)
- [IBM FactSheets](https://ieeexplore.ieee.org/document/8843893)
- [Model Cards](https://modelcards.withgoogle.com/)
### NLP Specific Paradigms
- [ACL Responsible NLP Checklist](https://aclrollingreview.org/responsibleNLPresearch/)
- [Augmented Datasheets for Speech Datasets](https://dl.acm.org/doi/10.1145/3593013.3594049)
- [Data Statements for NLP](https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00041/43452/Data-Statements-for-Natural-Language-Processing) 
### Domain Specific Paradigms
- [Artsheets for Art Datasets](https://datasets-benchmarks-proceedings.neurips.cc/paper_files/paper/2021/hash/9b8619251a19057cff70779273e95aa6-Abstract-round2.html) 
- [Healthsheets (Health Datasets)](https://dl.acm.org/doi/10.1145/3531146.3533239)
