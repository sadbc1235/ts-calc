import executeQuery from '../../_lib/db';
 
export async function POST(req: Request) {
  if (req.method === 'POST') {
      const reqJson = await req.json();
      const {wordSearch, nounSearch, searchLg} = reqJson;
      let result = {};

      const wordSql = `
      SELECT 
        common_word_seq               AS commonWordSeq
        , enactment_cnt               AS enactmentCnt
        , word_name_kor               AS wordNameKor
        , word_name_eng_short         AS wordNameEngShort
        , word_name_eng               AS wordNameEng
        , word_explain                AS wordExplain
        , formal_yn                   AS formalYn
        , domain_classification_name  AS domainClassificationName
        , same_mean_words             AS sameMeanWords
        , prohibition_words           AS prohibitionWords
      FROM	cust_name.ts_common_word
      WHERE `+ (searchLg == 'kor' ? `word_name_kor` : `word_name_eng`) +` REGEXP ?`;

      const wordList = await executeQuery(wordSql, [wordSearch]);

      const nounSql = `
      SELECT 
        noun.enactment_cnt          AS enactmentCnt
        , noun.noun_name_kor        AS nounNameKor
        , noun.noun_explain         AS nounExplain
        , noun.noun_name_eng_short  AS nounNameEngShort
        , noun.domain_name          AS domainName
        , domain.data_type          AS dataType
        , domain.data_length        AS dataLength
        , domain.allow_value        AS allowValue
        , domain.save_format        AS saveFormat
        , noun.same_mean_nouns      AS sameMeanNouns
      FROM	cust_name.ts_common_noun	noun

      LEFT JOIN cust_name.ts_common_domain	domain
      ON	noun.domain_name	= domain.domain_name
      
      WHERE `+ (searchLg == 'kor' ? `noun.noun_name_kor` : `noun.noun_name_eng_short`) +` LIKE CONCAT('%', ?, '%')`;

      const nounList = await executeQuery(nounSql, [nounSearch]);

      const domainSql = `
      SELECT 
        enactment_cnt                 AS enactmentCnt
        , domain_classification_name  AS domainClassificationName
        , data_type                   AS dataType
        , data_length                 AS dataLength
        , decimal_point_length        AS decimalPointLength
        , allow_value                 AS allowValue
        , save_format                 AS saveFormat
      FROM	cust_name.ts_common_domain`;

      const domainList = await executeQuery(domainSql, []);

      result['wordList'] = wordList;
      result['nounList'] = nounList;
      result['domainList'] = domainList;

      return Response.json(JSON.parse(JSON.stringify(result)));
  } else {
    // Handle any other HTTP method
  }
}